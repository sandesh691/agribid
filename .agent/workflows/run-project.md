---
description: How to run the AgriBid Marketplace Platform locally
---

To get the project up and running, follow these steps in your terminal:

// turbo
1. **Sync Dependencies**
   Ensure all packages are installed correctly.
   ```powershell
   npm install
   ```

// turbo
2. **Setup Database**
   This project uses SQLite. You need to push the Prisma schema to the local database file.
   ```powershell
   npx prisma db push
   ```

// turbo
3. **Generate Prisma Client**
   This step is crucial for TypeScript to recognize your database models.
   ```powershell
   npx prisma generate
   ```

// turbo
4. **Start Development Server**
   Launch the Next.js app in development mode.
   ```powershell
   npm run dev
   ```

### 🔑 Important Notes:
- **Admin Access**: The first user registered with role `ADMIN` is automatically verified.
- **Database**: Data is stored in `prisma/dev.db`.
- **Environment**: If you want to customize secrets, create a `.env` file and add `JWT_SECRET=your_secret_here`.
