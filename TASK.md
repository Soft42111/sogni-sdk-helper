# 🧠 AI Chat App – RAG System (Sogni SDK)

## 🎯 Objective
Build an AI chat system that answers user queries using Sogni SDK documentation via a Retrieval-Augmented Generation (RAG) pipeline.

The AI must NOT rely only on its internal knowledge. It must search documents when needed.

---

## 📚 Data Source
- Folder: /documents
- Contains Sogni SDK:
  - API docs
  - Guides
  - Auth flows
  - Examples
  - Token usage

---

## 🔁 RAG Pipeline (MANDATORY)

### 1. Intent Detection
Classify query:
- If Sogni / technical → ENABLE retrieval
- Else → normal response

---

### 2. Document Retrieval
- Perform semantic search on /documents
- Fallback: keyword search
- Retrieve top 3–5 relevant chunks
- DO NOT load full documents

---

### 3. Context Injection
- Inject retrieved chunks into model context
- Keep concise and relevant
- Remove noise

---

### 4. Response Generation
- Use retrieved context as PRIMARY source
- Use model knowledge as SECONDARY fallback

---

## ⚠️ Strict Rules
- Never hallucinate Sogni SDK details
- If info not found:
  → Respond: "This is not available in the provided Sogni documentation."
- Do not dump raw docs
- Always summarize clearly

---

## ⚡ Performance Rules
- Fast retrieval (<200ms target)
- Chunk size: 300–800 tokens
- Limit total injected tokens
- Optimize for Gemini Flash speed

---

## 🛠️ Implementation Notes
- Use embeddings for semantic search
- Store chunks in vector index
- Top-k retrieval (k=3–5)

---

## 🎯 Expected Behavior
The system should behave like:
- A documentation-aware AI
- A precise developer assistant
- A fast, reliable Sogni SDK guide