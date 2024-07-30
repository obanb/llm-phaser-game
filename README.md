##  RAG chat example setup

> Node.js RAG chat example for hotel guests

- **RAG:** Retrieval-Augmented Generation) - prompt > get context (Pinecone) > add context to query > ask OpenAI https://cloud.google.com/use-cases/retrieval-augmented-generation
- **Pinecone:** vector database for similarity search https://docs.pinecone.io/guides/get-started/quickstart
- **OpenAI Function calling**: bypasses context query for live data or performs an arbitrary action https://platform.openai.com/docs/guides/function-calling


### How it works

- load JSON sources > Pinecone index & vector store > prompt > get Pinecone similarity search > enrich context > OpenAI 1st call > Function Calling > enrich context > OpenAI 2nd call > response
- JSON data are converted to OpenAI embeddings (to vectors) on first run
- then they are stored in the Pinecone index together with the metadata
- the application then creates a Pinecone vector store from the existing index for querying the data
- when the user sends a prompt to the application, the application first tries to query the "local" vector store data and enrich the context with it
- the queries are evaluated by the so-called Function calling from OpenAI and the result of the evaluation is applied to the application function (get the current time, check the Cosmos DB, send an email), the result of which is again enriched the OpenAI chat context
- the whole context is passed to OpenAI, which only transforms the data into human speech

### Installation

Package install:

```
$ yarn install
```

.env variable if you want to use expressions with OpenAI language models

```
OPEN_AI_KEY=xxx
```

.env variable for Pinecone API key

```
PINECONE_KEY=xxx
```

.env variable for Cosmos DB

```
COSMOS_URI=xxx
```

.env variable for database name

```
COSMOS_DB=xxx
```

.env variable for the server port

```
PORT=8080
```

start

```
$ yarn run start
```

### Usage

- the first run is to create a Pinecone index and populate it with data from the ```__SOURCE__``` folder
- just chat with terminal


