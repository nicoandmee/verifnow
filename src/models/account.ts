export interface AccountInfo {

  /**
   * The user's current credit balance
   */
  balance: number

  /**
    * The user's username
  */
  username: string

  /**
   * The user's last 100 transactions
   */
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  amount: number
  timestamp: Date
  recipient?: string | null
  description: string
}
