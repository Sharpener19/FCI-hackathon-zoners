
  # Zoners

  Zoners is an AI-powered zoning bylaw exploration tool that amongst its many features allows users to query complex municipal zoning documents using natural language. This project was developed at FCI x LangChain: Building the Future Cities Hackathon (https://luma.com/jgxybphu?tk=Sp9GGl). 

  ## 🚀 Features

  - Ask natural-language questions about zoning bylaws
  - Build a searchable vector index from a zoning PDF
  - Return answers grounded in source text
  - Generate structured zoning summaries for frontend display

  ## 🧠 Tech Stack

  Frontend:
  - React
  - TypeScript
  - Vite

  BackEnd:
  - FastAPI
  - LangChain
  - FAISS
  - HuggingFace embeddings
  - Groq (LLaMa 3)

  ## ⚙️ Setup Instructions
  ### 1. Front End

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ### 2. Back End

  cd backend

  Run `python -m venv .venv` to set up a python virtual environment to install the required libraries.

  `pip install -r requirements.txt`

  `uvicorn app.main:app --reload`

  ### 3. Environment Variables

  Create file `backend./env` and set `GROQ_API_KEY=your_api_key_here`

  ### 4. (Optional) Prepare Zoning Document

  Place an initial bylaw PDF at backend/waterloo.pdf if not already present. The source of the download is:
  https://www.waterloo.ca/planning-and-development/check-zoning-and-land-use-rules/zoning-bylaw-and-map/

  ### 5. Build Vector Index
  
  Run in the PowerSheet (Windows):

  `Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/build-waterloo-index`

  ## How It Works
  1. PDF is parsed and split into chunks
  2. Text is embedded using HuggingFace models
  3. Stored in FAISS vector database
  4. User queries retrieve relevant zoning text
  5. LLaMA 3 (via Groq) generates grounded answers

  # Notes
  - This is a hackathon prototype
  - Parcel-level GIS map interaction is planned but not implemented

  ### Credits

  UI components adapted from shadcn/ui (MIT License)
  
