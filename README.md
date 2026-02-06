# Money Manager - Personal Finance Application

A comprehensive personal finance management application to track income, expenses, and manage accounts with ease.

![Money Manager](https://img.shields.io/badge/Money-Manager-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC)

## 🚀 Features

### Dashboard
- **Weekly/Monthly/Yearly Views**: Toggle between different time periods
- **Income vs Expense Charts**: Visual bar charts for comparison
- **Category Pie Charts**: See expense distribution by category
- **Summary Cards**: Quick view of total income, expense, and balance

### Transaction Management
- **Add Income/Expense**: Easy modal for adding transactions
- **Categories**: Fuel, Movie, Food, Loan, Medical, Shopping, Transport, Utilities, Entertainment, Education, and more
- **Divisions**: Classify transactions as Office or Personal
- **Date & Time Tracking**: Full timestamp for each transaction
- **12-Hour Edit Window**: Edit/delete transactions within 12 hours of creation

### Filtering & Search
- **Filter by Division**: Office, Personal, or All
- **Filter by Category**: Any available category
- **Date Range Filter**: Track transactions between two specific dates

### Account Management
- **Multiple Accounts**: Cash, Bank Account, Credit Card
- **Account Balances**: Real-time balance tracking
- **Transfers**: Move money between accounts
- **Transfer History**: Complete record of all transfers

### Reports & Summary
- **Category Summary**: See totals for each category
- **Period Comparison**: Compare income/expense across periods
- **Visual Charts**: Interactive Recharts visualizations

## 📁 Project Structure

```
money-manager/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # React Context for state management
│   │   ├── data/             # Initial data
│   │   ├── services/         # API service for backend
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── index.html
│   └── package.json
│
└── backend/                  # Spring Boot Backend
    ├── src/main/java/com/moneymanager/
    │   ├── config/           # Configuration classes
    │   ├── controller/       # REST Controllers
    │   ├── dto/              # Data Transfer Objects
    │   ├── exception/        # Custom exceptions
    │   ├── model/            # Entity models
    │   ├── repository/       # MongoDB repositories
    │   └── service/          # Business logic
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS 4** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **date-fns** for date handling

### Backend
- **Java 17**
- **Spring Boot 3.2**
- **Spring Data MongoDB**
- **MongoDB Atlas**
- **Lombok** for reducing boilerplate
- **SpringDoc OpenAPI** for API documentation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure MongoDB in `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/money_manager
```

3. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🌐 Deployment to GitHub Pages

### Prerequisites
- Repository created on GitHub
- GitHub Pages enabled in repository settings

### Deployment Steps

1. Build the application:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

3. (Optional) If you encounter issues, clean and redeploy:
```bash
npm run clean  # Removes dist and cache
npm run deploy
```

The deployment script will:
- Build the production version
- Create a `.nojekyll` file to prevent Jekyll processing
- Push the `dist` folder to the `gh-pages` branch
- Make the site available at `https://[username].github.io/[repository-name]/`

### Important Configuration

The `vite.config.ts` is configured with the correct base path:
```typescript
base: '/money-manager-frontend/'
```

Ensure this matches your repository name. If your repository name is different, update this value in `vite.config.ts`.

### Troubleshooting

**Blank Page Issue:**
- ✅ Removed `viteSingleFile` plugin (causes issues with GitHub Pages)
- ✅ Added `.nojekyll` file to prevent Jekyll processing
- ✅ Configured correct base path in `vite.config.ts`

If you still see a blank page:
1. Check GitHub Pages settings (Settings → Pages)
2. Ensure the source is set to `gh-pages` branch
3. Verify the base path matches your repository name
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

**"Your local changes would be overwritten" Error:**

If you encounter this error during deployment:
```
error: Your local changes to the following files would be overwritten by checkout:
        index.html
```

**Quick Fix:**
```bash
npm run clean   # Clear dist and gh-pages cache
npm run deploy  # Redeploy
```

**Solution:** The deploy script uses the `--add` flag to prevent this issue:
```bash
npm run deploy  # Uses: gh-pages -d dist --dotfiles --add --no-cache
```

If the error persists:
1. Pull the latest code: `git pull`
2. Ensure working directory is clean: `git status`
3. Commit or stash any uncommitted changes before deploying
4. Try the clean script: `npm run clean && npm run deploy`

See `DEPLOYMENT_GUIDE.md` for more detailed troubleshooting.

**"Filename too long" Error on Windows:**

If you encounter this error during deployment:
```
error: unable to create file ...: Filename too long
fatal: unable to checkout working tree
```

This happens when:
- Windows has a default MAX_PATH limit of 260 characters
- The gh-pages package clones the repository to a cache directory
- Long paths in node_modules exceed this limit

**Solutions:**
1. ✅ Ensure `node_modules` is in `.gitignore` and not committed to git
2. ✅ Run `npm run deploy` which uses `--no-cache` flag
3. If the error persists, enable long path support in Windows:
   ```powershell
   # Run as Administrator
   git config --system core.longpaths true
   ```
4. Alternative: Use GitHub Actions for deployment (see below)

**Windows Long Path Configuration:**

Enable long path support in Windows 10/11:
1. Open Registry Editor (regedit)
2. Navigate to: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
3. Set `LongPathsEnabled` to `1`
4. Restart your computer

Or use PowerShell (run as Administrator):
```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### Using Without Backend

The frontend works standalone using localStorage for data persistence. This is useful for:
- Demo purposes
- Quick testing
- Offline usage

To use with the backend, the API service in `src/services/api.ts` is ready to connect.

## 📚 API Documentation

When the backend is running, access:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

### Main Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/transactions` | Get all transactions with filters |
| `POST /api/transactions` | Create new transaction |
| `PUT /api/transactions/{id}` | Update transaction |
| `DELETE /api/transactions/{id}` | Delete transaction |
| `GET /api/accounts` | Get all accounts |
| `POST /api/transfers` | Create transfer between accounts |
| `GET /api/dashboard/summary/monthly` | Get monthly summary |
| `GET /api/categories` | Get all categories |

## 🎨 Screenshots

### Dashboard
- Summary cards showing income, expense, and balance
- Bar chart comparing income vs expense over time
- Pie chart showing expense breakdown by category

### Transaction History
- Filterable list of all transactions
- Edit/delete capability within 12 hours
- Visual indicators for editable transactions

### Accounts
- Account cards with current balances
- Transfer money between accounts
- Transfer history

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist your IP address
5. Get connection string
6. Update `application.properties`

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for personal finance management
