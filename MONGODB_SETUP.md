# MongoDB Atlas Setup Guide for Money Manager

## Quick Setup Steps

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"** and create an account
3. Verify your email address

### Step 2: Create a Free Cluster

1. After logging in, click **"Build a Database"**
2. Select **"M0 FREE"** tier (Shared)
3. Choose your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Select a region close to you
5. Click **"Create"** (takes 1-3 minutes)

### Step 3: Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `moneymanager`)
5. Create a password - **IMPORTANT:** 
   - Use only letters, numbers, and simple characters
   - **AVOID** special characters like `@`, `:`, `/`, `?`, `#` in your password
   - If you must use special characters, see the "Password Encoding" section below
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
   - For production, use specific IP addresses
4. Click **"Confirm"**

### Step 5: Get Your Connection Details

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Note down your cluster address (e.g., `cluster0.abc123.mongodb.net`)

### Step 6: Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Replace with YOUR actual values
mongodb.host=cluster0.abc123.mongodb.net
mongodb.database=money_manager
mongodb.username=moneymanager
mongodb.password=YourActualPassword
```

### Step 7: Run the Application

```bash
cd backend
./mvnw spring-boot:run
```

---

## Password with Special Characters

If your MongoDB password contains special characters, they MUST be URL encoded.

### Common Special Character Encodings:

| Character | URL Encoded |
|-----------|-------------|
| `@`       | `%40`       |
| `:`       | `%3A`       |
| `/`       | `%2F`       |
| `?`       | `%3F`       |
| `#`       | `%23`       |
| `!`       | `%21`       |
| `$`       | `%24`       |
| `&`       | `%26`       |
| `%`       | `%25`       |
| `+`       | `%2B`       |
| `=`       | `%3D`       |
| `[`       | `%5B`       |
| `]`       | `%5D`       |

### Example:

If your password is: `MyP@ss:word!123`

**Option 1:** Use the application.properties with separate fields (RECOMMENDED)
- The MongoConfig class will automatically URL encode your password
- Just enter: `mongodb.password=MyP@ss:word!123`

**Option 2:** If using a direct URI, encode manually:
```properties
spring.data.mongodb.uri=mongodb+srv://user:MyP%40ss%3Aword%21123@cluster0.abc123.mongodb.net/money_manager
```

---

## Local MongoDB Setup (Alternative)

If you prefer to run MongoDB locally instead of using Atlas:

### Install MongoDB Community Edition

**Windows:**
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB runs as a service automatically

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

### Configure for Local MongoDB

Use the local profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Or edit `application.properties`:

```properties
mongodb.host=localhost
mongodb.port=27017
mongodb.database=money_manager
mongodb.username=
mongodb.password=
```

---

## Verify Connection

### Check Application Logs

When the application starts, you should see:

```
========================================
MongoDB Connection Info:
  Host: cluster0.abc123.mongodb.net
  Database: money_manager
  Username: moneymanager
  Password: ****
========================================
```

### Test API Endpoints

1. **Swagger UI:** http://localhost:8080/swagger-ui.html
2. **Health Check:** http://localhost:8080/api/categories
3. **Transactions:** http://localhost:8080/api/transactions

---

## Troubleshooting

### Error: "Connection string contains invalid user information"

**Cause:** Your password contains special characters that aren't URL encoded.

**Solution:** 
- Use the separate properties approach in `application.properties`
- The `MongoConfig` class handles encoding automatically

### Error: "Connection refused" or "Timeout"

**Cause:** Network access not configured or IP not whitelisted.

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add your current IP or allow all IPs (0.0.0.0/0)

### Error: "Authentication failed"

**Cause:** Wrong username or password.

**Solution:**
1. Verify your credentials in Database Access
2. Reset password if needed
3. Make sure you're using the database user credentials (not your Atlas account)

### Error: "Cannot resolve host"

**Cause:** Wrong cluster hostname.

**Solution:**
1. Go to MongoDB Atlas → Database → Connect
2. Copy the exact hostname from the connection string

---

## Sample Connection Strings

### MongoDB Atlas:
```
mongodb+srv://moneymanager:password123@cluster0.abc123.mongodb.net/money_manager?retryWrites=true&w=majority
```

### Local MongoDB:
```
mongodb://localhost:27017/money_manager
```

### Local MongoDB with Auth:
```
mongodb://admin:password@localhost:27017/money_manager?authSource=admin
```
