// Embedded Offline Question Datasets for 100% Offline & file:// Execution
window.EMBEDDED_EXAMS = {
  "mock-questions-jee.json": {
  "examTitle": "National CBT Mock Examination 2026 (Physics, Chemistry & Mathematics)",
  "durationMinutes": 45,
  "positiveMarks": 4,
  "negativeMarks": 1,
  "subjects": ["Physics", "Chemistry", "Mathematics"],
  "questions": [
    {
      "id": 1,
      "subject": "Physics",
      "question": "What is the SI unit of electric charge?",
      "options": ["Volt", "Coulomb", "Ohm", "Tesla"],
      "correct": 1,
      "explanation": "Coulomb (C) is the SI unit of electric charge, defined as the charge transported by a constant current of one ampere in one second."
    },
    {
      "id": 2,
      "subject": "Physics",
      "question": "Why can no heat engine beat Carnot efficiency operating between two given temperatures Th and Tc?",
      "options": [
        "Because of friction in real engines",
        "Because it would violate the Second Law of Thermodynamics (Clausius/Kelvin-Planck statement)",
        "Because ideal gases do not exist",
        "Carnot efficiency can be beaten using quantum fluids"
      ],
      "correct": 1,
      "explanation": "Carnot's theorem is a direct consequence of the Second Law of Thermodynamics; any engine more efficient than a reversible Carnot engine could be paired to create a perpetual motion machine of the second kind."
    },
    {
      "id": 3,
      "subject": "Physics",
      "question": "A body is projected vertically upwards with velocity u. The maximum height reached is:",
      "options": ["u / g", "u^2 / (2g)", "2u / g", "u^2 / g"],
      "correct": 1,
      "explanation": "Using v^2 = u^2 - 2gh with final velocity v = 0 gives h = u^2 / (2g)."
    },
    {
      "id": 4,
      "subject": "Physics",
      "question": "The dimensional formula of Planck's constant (h) is:",
      "options": ["[M L^2 T^-1]", "[M L T^-1]", "[M L^2 T^-2]", "[M L^-1 T^-2]"],
      "correct": 0,
      "explanation": "E = h*nu => h = E / nu = [M L^2 T^-2] / [T^-1] = [M L^2 T^-1]."
    },
    {
      "id": 5,
      "subject": "Physics",
      "question": "In a p-n junction diode under forward bias, the depletion layer width:",
      "options": ["Increases", "Decreases", "Remains unchanged", "Becomes infinite"],
      "correct": 1,
      "explanation": "Forward bias opposes the built-in potential barrier, narrowing the depletion region and allowing majority carrier diffusion."
    },
    {
      "id": 6,
      "subject": "Chemistry",
      "question": "Which of the following molecules has a zero dipole moment due to symmetric geometry?",
      "options": ["H2O", "NH3", "BF3", "SO2"],
      "correct": 2,
      "explanation": "BF3 has a trigonal planar geometry with 120-degree bond angles where the three B-F bond dipoles vectorially cancel out to zero."
    },
    {
      "id": 7,
      "subject": "Chemistry",
      "question": "The oxidation state of Chromium in K2Cr2O7 is:",
      "options": ["+3", "+6", "+7", "+4"],
      "correct": 1,
      "explanation": "2(+1) + 2(Cr) + 7(-2) = 0 => 2 + 2(Cr) - 14 = 0 => 2(Cr) = 12 => Cr = +6."
    },
    {
      "id": 8,
      "subject": "Chemistry",
      "question": "Which orbital has a spherical node?",
      "options": ["1s", "2s", "2p", "3d"],
      "correct": 1,
      "explanation": "Radial nodes = n - l - 1. For 2s orbital, n=2, l=0, nodes = 2 - 0 - 1 = 1 spherical radial node."
    },
    {
      "id": 9,
      "subject": "Chemistry",
      "question": "The conjugate base of H2PO4^- is:",
      "options": ["H3PO4", "HPO4^2-", "PO4^3-", "P2O5"],
      "correct": 1,
      "explanation": "Removing one proton (H+) from H2PO4^- yields its conjugate base HPO4^2-."
    },
    {
      "id": 10,
      "subject": "Chemistry",
      "question": "Which gas is evolved at the cathode during electrolysis of brine (aqueous NaCl)?",
      "options": ["Chlorine (Cl2)", "Hydrogen (H2)", "Oxygen (O2)", "Sodium vapor"],
      "correct": 1,
      "explanation": "At the cathode, reduction of H2O to H2 gas has a more positive reduction potential than Na+ to Na."
    },
    {
      "id": 11,
      "subject": "Mathematics",
      "question": "The value of lim (x->0) (sin 3x) / x is:",
      "options": ["1", "3", "0", "1/3"],
      "correct": 1,
      "explanation": "Multiply and divide by 3: lim (x->0) 3 * [sin(3x) / (3x)] = 3 * 1 = 3."
    },
    {
      "id": 12,
      "subject": "Mathematics",
      "question": "If matrix A is orthogonal, then determinant det(A) is equal to:",
      "options": ["0", "+1 or -1", "Only +1", "Infinity"],
      "correct": 1,
      "explanation": "For orthogonal matrix A*A^T = I => det(A)*det(A^T) = det(I) => [det(A)]^2 = 1 => det(A) = +/- 1."
    },
    {
      "id": 13,
      "subject": "Mathematics",
      "question": "The number of ways to arrange the letters of the word 'BHARAT' is:",
      "options": ["720", "360", "120", "240"],
      "correct": 1,
      "explanation": "BHARAT has 6 letters with 'A' repeating twice: 6! / 2! = 720 / 2 = 360."
    },
    {
      "id": 14,
      "subject": "Mathematics",
      "question": "The derivative of e^(x^2) with respect to x is:",
      "options": ["e^(x^2)", "2x * e^(x^2)", "x^2 * e^(x^2 - 1)", "2 * e^(x^2)"],
      "correct": 1,
      "explanation": "By chain rule, d/dx[e^(u)] = e^u * du/dx = e^(x^2) * 2x."
    },
    {
      "id": 15,
      "subject": "Mathematics",
      "question": "The sum of the infinite geometric series 1 + 1/2 + 1/4 + 1/8 + ... is:",
      "options": ["1.5", "2", "3", "Infinity"],
      "correct": 1,
      "explanation": "S = a / (1 - r) = 1 / (1 - 0.5) = 1 / 0.5 = 2."
    }
  ]
}
,
  "mock-questions-genai.json": {
  "examTitle": "GenAI & Systems Architecture Assessment (15 Questions)",
  "durationMinutes": 30,
  "positiveMarks": 4,
  "negativeMarks": 1,
  "subjects": ["Generative AI", "Software Architecture", "Browser Engineering"],
  "questions": [
    {
      "id": 1,
      "subject": "Generative AI",
      "question": "In Transformer self-attention, what is the computational complexity with respect to sequence length N?",
      "options": ["O(N)", "O(N log N)", "O(N^2)", "O(N^3)"],
      "correct": 2,
      "explanation": "Standard self-attention computes an N x N attention matrix (Q * K^T), resulting in O(N^2) memory and time complexity."
    },
    {
      "id": 2,
      "subject": "Generative AI",
      "question": "Which temperature parameter value produces the most deterministic greedy token sampling in LLMs?",
      "options": ["T = 0.0", "T = 0.7", "T = 1.0", "T = 2.0"],
      "correct": 0,
      "explanation": "Temperature = 0 collapses the softmax probability distribution onto the argmax token, generating strictly deterministic output."
    },
    {
      "id": 3,
      "subject": "Generative AI",
      "question": "What is the primary function of Vector Embeddings in Retrieval-Augmented Generation (RAG)?",
      "options": [
        "To encrypt user queries",
        "To map semantic meaning into high-dimensional geometric proximity",
        "To compress text into zip format",
        "To fine-tune model weights"
      ],
      "correct": 1,
      "explanation": "Embeddings project semantic meaning into dense vectors where cosine distance reflects conceptual similarity."
    },
    {
      "id": 4,
      "subject": "Generative AI",
      "question": "In LoRA (Low-Rank Adaptation), parameter-efficient fine-tuning is achieved by decomposing weight update delta-W into:",
      "options": ["Eigenvalues only", "Two low-rank matrices B and A such that W = W0 + B*A", "Random gaussian noise", "Scalar multipliers"],
      "correct": 1,
      "explanation": "LoRA constrains the rank of delta-W through matrix multiplication of rank r << d, drastically reducing trainable parameters."
    },
    {
      "id": 5,
      "subject": "Generative AI",
      "question": "What technique avoids catastrophic forgetting during sequential task learning in AI?",
      "options": ["Gradient Ascent", "Elastic Weight Consolidation / Replay buffers", "Random dropout 0.99", "Zero initialization"],
      "correct": 1,
      "explanation": "Elastic Weight Consolidation slows down learning on weights critical to previous tasks, preventing catastrophic forgetting."
    },
    {
      "id": 6,
      "subject": "Software Architecture",
      "question": "Which design pattern is best suited for decoupling notification producers from unknown consumers?",
      "options": ["Singleton", "Observer / Pub-Sub", "Decorator", "Factory Method"],
      "correct": 1,
      "explanation": "Observer/Pub-Sub enables loose coupling where publishers dispatch events to registered subscribers without tight dependencies."
    },
    {
      "id": 7,
      "subject": "Software Architecture",
      "question": "What does the 'I' represent in SOLID principles of object-oriented design?",
      "options": ["Inheritance Hierarchy", "Interface Segregation Principle", "Inversion of Control", "Immutable State"],
      "correct": 1,
      "explanation": "Interface Segregation states that clients should not be forced to depend upon interfaces they do not use."
    },
    {
      "id": 8,
      "subject": "Software Architecture",
      "question": "In ACID database transactions, what does Isolation guarantee?",
      "options": [
        "Transactions run entirely on separate physical disks",
        "Concurrent execution of transactions leaves the database in the same state as if executed serially",
        "Data is never deleted",
        "Hardware failures are prevented"
      ],
      "correct": 1,
      "explanation": "Isolation prevents race conditions and dirty reads by ensuring concurrent transactions execute without interference."
    },
    {
      "id": 9,
      "subject": "Software Architecture",
      "question": "Which data structure provides amortized O(1) time complexity for lookup, insertion, and deletion?",
      "options": ["Binary Search Tree", "Hash Table", "Skip List", "Red-Black Tree"],
      "correct": 1,
      "explanation": "Hash tables compute array index via hashing function providing O(1) amortized average operations."
    },
    {
      "id": 10,
      "subject": "Software Architecture",
      "question": "In Distributed Systems, what does CAP theorem state is impossible to guarantee simultaneously in network partitions?",
      "options": ["Consistency and Availability", "Concurrency and Portability", "Speed and Reliability", "Accuracy and Compression"],
      "correct": 0,
      "explanation": "Under network partition (P), a distributed system must trade off between Consistency (C) and Availability (A)."
    },
    {
      "id": 11,
      "subject": "Browser Engineering",
      "question": "What is the primary benefit of Service Workers in Progressive Web Apps (PWAs)?",
      "options": [
        "Accessing native GPU assembly instructions directly",
        "Interception of network requests and offline asset caching",
        "Bypassing Same-Origin Policy",
        "Executing root level shell commands"
      ],
      "correct": 1,
      "explanation": "Service Workers run in a background thread intercepting HTTP fetch requests, enabling instant offline cache serving."
    },
    {
      "id": 12,
      "subject": "Browser Engineering",
      "question": "In Chrome Extension Manifest V3, what replaces persistent background pages?",
      "options": ["ActiveX plugins", "Ephemeral Service Workers", "Native C++ daemons", "WebSocket servers"],
      "correct": 1,
      "explanation": "Manifest V3 replaces background pages with event-driven Service Workers that sleep when idle to preserve system RAM."
    },
    {
      "id": 13,
      "subject": "Browser Engineering",
      "question": "Which browser API permits high-performance 2D raster and vector graphics rendering via JavaScript?",
      "options": ["HTML5 Canvas 2D Context", "Web Audio API", "Web Bluetooth", "Geolocation API"],
      "correct": 0,
      "explanation": "HTMLCanvasElement.getContext('2d') gives direct low-level immediate-mode rendering capabilities."
    },
    {
      "id": 14,
      "subject": "Browser Engineering",
      "question": "What Chrome API function allows discarding a tab's background memory while keeping its tab entry in the browser tab strip?",
      "options": ["chrome.tabs.remove()", "chrome.tabs.discard()", "chrome.tabs.reload()", "chrome.tabs.mute()"],
      "correct": 1,
      "explanation": "chrome.tabs.discard() unloads the tab's DOM and processes from RAM while leaving the tab in the strip for instant waking."
    },
    {
      "id": 15,
      "subject": "Browser Engineering",
      "question": "How does `requestAnimationFrame` differ from `setInterval(..., 16)`?",
      "options": [
        "It synchronizes rendering callbacks to the display refresh rate and pauses in hidden tabs",
        "It runs on a separate GPU thread",
        "It uses 10x more battery",
        "There is no difference"
      ],
      "correct": 0,
      "explanation": "requestAnimationFrame aligns execution with the V-Sync refresh cycle and automatically pauses when the tab is backgrounded."
    }
  ]
}

};
