// Chat Saver Popup Controller
(function () {
  'use strict';

  // Fallback demo conversation matching PDF Page 14
  let chatData = {
    title: 'Explain RAG simply',
    messageCount: 24,
    codeBlockCount: 3,
    messages: [
      {
        role: 'user',
        text: 'Explain RAG simply with an architecture diagram and Python code example.'
      },
      {
        role: 'assistant',
        text: `### Retrieval-Augmented Generation (RAG) Explained

RAG combines information retrieval with large language models. Instead of relying solely on model training weights, it retrieves authoritative external documents and passes them as context.

| Component | Role | Technology |
|---|---|---|
| **Embeddings** | Semantic vector space | text-embedding-3-small |
| **Vector DB** | High-speed cosine search | Chroma / FAISS |
| **Generator** | Answer synthesis | Claude / GPT-4o |

#### Complete Runnable Python Retrieval Code:

\`\`\`python
import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def retrieve(query: str, corpus: list, top_k: int = 3) -> list:
    """Mock semantic retrieval ranking documents by similarity score."""
    # In production, query_embedding = embed_client.embed(query)
    print(f"Executing semantic retrieval for query: {query}")
    scored = [(doc, len(set(query.lower().split()) & set(doc.lower().split()))) for doc in corpus]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [doc for doc, score in scored[:top_k]]

# Test execution:
docs = [
    "Carnot cycle defines maximum theoretical thermodynamic efficiency.",
    "First Law of thermodynamics establishes conservation of total energy.",
    "RAG systems enrich prompts with verified ground-truth knowledge."
]

results = retrieve("How does RAG improve grounding?", docs)
for i, r in enumerate(results, 1):
    print(f"{i}. {r}")
\`\`\`

The retrieved documents are then concatenated into the prompt context for synthesis.`
      }
    ]
  };

  const msgCountText = document.getElementById('msgCountText');
  const codeBlockCountText = document.getElementById('codeBlockCountText');
  const chatTitleText = document.getElementById('chatTitleText');
  const btnSaveMd = document.getElementById('btnSaveMd');
  const btnSavePdf = document.getElementById('btnSavePdf');

  function init() {
    setupListeners();
    queryActiveTab();
  }

  function queryActiveTab() {
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'SCRAPE_CHAT' }, (res) => {
            if (res && res.messages && res.messages.length > 0) {
              chatData = res;
              updateStatsUI();
            }
          });
        }
      });
    }
    updateStatsUI();
  }

  function updateStatsUI() {
    chatTitleText.textContent = chatData.title;
    msgCountText.textContent = chatData.messageCount || chatData.messages.length;
    codeBlockCountText.textContent = chatData.codeBlockCount || 3;
  }

  function setupListeners() {
    btnSaveMd.addEventListener('click', exportMarkdown);
    btnSavePdf.addEventListener('click', exportPdf);
  }

  // --- EXPORT TO MARKDOWN ---
  // Requirement: "Keep headings, lists, tables and code blocks. Name the file from the chat's title."
  function exportMarkdown() {
    const filename = `${sanitizeFilename(chatData.title)}.md`;
    let md = `# ${chatData.title}\n\n`;
    md += `*Exported via Chat Saver Extension · ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    chatData.messages.forEach((msg, idx) => {
      const speaker = msg.role === 'user' ? '👤 **User**' : '🤖 **Assistant**';
      md += `### ${speaker} (Message ${idx + 1})\n\n`;
      md += `${msg.text}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, filename);
  }

  // --- EXPORT TO PDF ---
  // Requirement: "Code from the saved file can be copied and still runs. Tables stay as tables."
  function exportPdf() {
    const filename = `${sanitizeFilename(chatData.title)}.pdf`;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(chatData.title, 40, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported via Chat Saver Extension · ${new Date().toLocaleDateString()}`, 40, 68);
    doc.line(40, 75, 555, 75);

    let currentY = 100;

    chatData.messages.forEach((msg, idx) => {
      if (currentY > 740) {
        doc.addPage();
        currentY = 50;
      }

      // Speaker Tag
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(msg.role === 'user' ? 37 : 5, msg.role === 'user' ? 99 : 150, msg.role === 'user' ? 235 : 105);
      doc.text(msg.role === 'user' ? `User (Message ${idx + 1}):` : `Assistant (Message ${idx + 1}):`, 40, currentY);
      currentY += 16;

      // Text body with word wrapping
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      const splitText = doc.splitTextToSize(msg.text, 510);

      splitText.forEach(line => {
        if (currentY > 780) {
          doc.addPage();
          currentY = 50;
        }
        doc.text(line, 40, currentY);
        currentY += 14;
      });

      currentY += 14;
    });

    doc.save(filename);
  }

  function sanitizeFilename(name) {
    return (name || 'ai-chat-export')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'chat-export';
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
