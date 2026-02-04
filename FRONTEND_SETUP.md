# Frontend Setup Guide

## Quick Setup Instructions

You have two options to run the frontend:

---

## Option 1: Create New React Project (Recommended)

### Step 1: Open a NEW terminal and navigate to your hackathon folder
```bash
cd C:\Users\iamna\Desktop\IntelliJ\HCL GUI Hackathon
```

### Step 2: Create new Vite React project
```bash
npm create vite@latest money-manager-frontend -- --template react-ts
cd money-manager-frontend
```

### Step 3: Install dependencies
```bash
npm install
npm install tailwindcss @tailwindcss/vite postcss autoprefixer
npm install recharts date-fns lucide-react uuid
npm install -D @types/uuid
```

### Step 4: Initialize Tailwind
```bash
npx tailwindcss init -p
```

### Step 5: Copy the source files
Copy all the files from the `src` folder I'll provide below.

### Step 6: Run the frontend
```bash
npm run dev
```

The frontend will run on http://localhost:5173

---

## Option 2: Download Complete Frontend

I'll provide you with a complete package.json and all source files below.

### Step 1: Create frontend directory
```bash
cd C:\Users\iamna\Desktop\IntelliJ\HCL GUI Hackathon
mkdir money-manager-frontend
cd money-manager-frontend
```

### Step 2: Create package.json
Create a file named `package.json` with the content provided below.

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Create all source files
Create the folder structure and files as provided below.

### Step 5: Run
```bash
npm run dev
```

---

## Project Structure

```
money-manager-frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── context/
    │   └── MoneyContext.tsx
    ├── data/
    │   └── initialData.ts
    ├── services/
    │   └── api.ts
    └── components/
        ├── Dashboard.tsx
        ├── TransactionHistory.tsx
        ├── Accounts.tsx
        ├── AddTransactionModal.tsx
        ├── EditTransactionModal.tsx
        ├── TransferModal.tsx
        └── CategoryIcon.tsx
```

---

## Connecting to Backend

The frontend is configured to connect to your Spring Boot backend at `http://localhost:8080`.

Make sure your Spring Boot backend is running before starting the frontend!

---

## Files to Create

See the next sections for complete file contents...
