
  # Zoners

  This is a code bundle for Zoning By-Laws. Test repo for now. Contribute to Sharpener19/FCI-hackathon development by creating an account on GitHub.

  ## Features

  - Ask natural-language questions about zoning bylaws
  - Build a searchable vector index from a zoning PDF
  - Return answers grounded in source text
  - Generate structured zoning summaries for frontend display

  ## Running the code
  Front End Setup:

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  Back End Setup:

  cd backend

  pip install -r requirements.txt

  uvicorn app.main:app --reload

  Environment Variables:

  Create backend./env and set GROQ_API_KEY=your_api_key_here

  Place an initial bylaw PDF at backend/waterloo.pdf if not already present. The source of the download is:
  https://www.waterloo.ca/planning-and-development/check-zoning-and-land-use-rules/zoning-bylaw-and-map/

  Then Run in the PowerSheel (Windows):

  Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/build-waterloo-index

  Demo Flow

  1) Start Backend
  2) Build zoning index from PDF
  3) Open frontend
  4) Ask zoning questions in the Search Page
  5) Receive grounded answers with source excerpts

## Tech Stack

  Frontend:
  - React, TypeScript, Vite

  BackEnd:
  - FastAPI, LangChain, FAISS, HuggingFace embeddings, Groq / LLaMa 3

  ### Credits

  UI components adapted from shadcn/ui (MIT License)
  