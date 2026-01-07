
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  verified: 'verified',
  accountStatus: 'accountStatus',
  trustScore: 'trustScore',
  language: 'language',
  createdAt: 'createdAt'
};

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  subject: 'subject',
  description: 'description',
  status: 'status',
  adminNote: 'adminNote',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FarmerScalarFieldEnum = {
  id: 'id',
  userId: 'userId'
};

exports.Prisma.RetailerScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  businessName: 'businessName',
  gstId: 'gstId'
};

exports.Prisma.CropScalarFieldEnum = {
  id: 'id',
  name: 'name',
  totalQuantity: 'totalQuantity',
  availableQuantity: 'availableQuantity',
  qualityGrade: 'qualityGrade',
  minPrice: 'minPrice',
  image: 'image',
  biddingType: 'biddingType',
  status: 'status',
  biddingStatus: 'biddingStatus',
  biddingStartTime: 'biddingStartTime',
  biddingEndTime: 'biddingEndTime',
  scheduledStartTime: 'scheduledStartTime',
  scheduledDuration: 'scheduledDuration',
  attemptNumber: 'attemptNumber',
  farmerId: 'farmerId',
  pooledCropId: 'pooledCropId'
};

exports.Prisma.BidScalarFieldEnum = {
  id: 'id',
  cropId: 'cropId',
  retailerId: 'retailerId',
  quantity: 'quantity',
  pricePerKg: 'pricePerKg',
  timestamp: 'timestamp',
  status: 'status'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  cropId: 'cropId',
  farmerId: 'farmerId',
  retailerId: 'retailerId',
  quantityPurchased: 'quantityPurchased',
  pricePerKg: 'pricePerKg',
  totalAmount: 'totalAmount',
  timestamp: 'timestamp',
  orderStatus: 'orderStatus',
  paymentStatus: 'paymentStatus'
};

exports.Prisma.DisputeScalarFieldEnum = {
  id: 'id',
  transactionId: 'transactionId',
  reason: 'reason',
  evidence: 'evidence',
  status: 'status',
  result: 'result'
};

exports.Prisma.ViolationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  description: 'description',
  timestamp: 'timestamp'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  details: 'details',
  timestamp: 'timestamp'
};

exports.Prisma.PooledCropScalarFieldEnum = {
  id: 'id',
  name: 'name',
  status: 'status'
};

exports.Prisma.WalletScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  balance: 'balance'
};

exports.Prisma.WalletTransactionScalarFieldEnum = {
  id: 'id',
  walletId: 'walletId',
  amount: 'amount',
  type: 'type',
  description: 'description',
  timestamp: 'timestamp'
};

exports.Prisma.ChatScalarFieldEnum = {
  id: 'id',
  transactionId: 'transactionId'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  chatId: 'chatId',
  senderId: 'senderId',
  receiverId: 'receiverId',
  content: 'content',
  timestamp: 'timestamp'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  message: 'message',
  read: 'read',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Report: 'Report',
  Farmer: 'Farmer',
  Retailer: 'Retailer',
  Crop: 'Crop',
  Bid: 'Bid',
  Transaction: 'Transaction',
  Dispute: 'Dispute',
  Violation: 'Violation',
  AuditLog: 'AuditLog',
  PooledCrop: 'PooledCrop',
  Wallet: 'Wallet',
  WalletTransaction: 'WalletTransaction',
  Chat: 'Chat',
  Message: 'Message',
  Notification: 'Notification'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
