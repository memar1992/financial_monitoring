exports.shorthands = undefined;

exports.up = pgm => {
  // USERS
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(20)', default: 'main' },
    parent_id: { type: 'integer', references: 'users', onDelete: 'SET NULL' },
    is_active: { type: 'boolean', default: true },
    last_login: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
    updated_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  pgm.addConstraint('users', 'role_check', {
    check: "role IN ('super_admin', 'main', 'member')"
  });

  // API KEYS
  pgm.createTable('api_keys', {
    id: 'id',
    user_id: { type: 'integer', references: 'users', onDelete: 'CASCADE' },
    key: { type: 'varchar(255)', notNull: true, unique: true },
    name: { type: 'varchar(100)' },
    permissions: { type: 'jsonb', default: '{}' },
    expires_at: { type: 'timestamp' },
    last_used_at: { type: 'timestamp' },
    is_active: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  // REFRESH TOKENS
  pgm.createTable('refresh_tokens', {
    id: 'id',
    user_id: { type: 'integer', references: 'users', onDelete: 'CASCADE' },
    token: { type: 'text', notNull: true },
    expires_at: { type: 'timestamp', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  // ACCOUNTS
  pgm.createTable('accounts', {
    id: 'id',
    user_id: { type: 'integer', references: 'users', onDelete: 'CASCADE' },
    name: { type: 'varchar(100)', notNull: true },
    type: { type: 'varchar(50)' },
    balance: { type: 'numeric(12,2)', default: 0 },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  // CATEGORIES
  pgm.createTable('categories', {
    id: 'id',
    user_id: { type: 'integer', references: 'users', onDelete: 'CASCADE' },
    name: { type: 'varchar(100)', notNull: true },
    type: { type: 'varchar(20)', notNull: true },
    color: { type: 'varchar(10)' },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  pgm.addConstraint('categories', 'categories_type_check', {
    check: "type IN ('income', 'expense')"
  });

  // TRANSACTIONS
  pgm.createTable('transactions', {
    id: 'id',
    user_id: { type: 'integer', references: 'users', onDelete: 'CASCADE' },
    account_id: { type: 'integer', references: 'accounts', onDelete: 'SET NULL' },
    category_id: { type: 'integer', references: 'categories', onDelete: 'SET NULL' },
    type: { type: 'varchar(20)', notNull: true },
    amount: { type: 'numeric(12,2)', notNull: true },
    description: { type: 'text' },
    transacted_at: { type: 'timestamp', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  pgm.addConstraint('transactions', 'transactions_type_check', {
    check: "type IN ('income', 'expense')"
  });

  // BUDGETS
  pgm.createTable('budgets', {
    id: 'id',
    user_id: { type: 'integer', references: 'users', onDelete: 'CASCADE' },
    category_id: { type: 'integer', references: 'categories', onDelete: 'CASCADE' },
    amount_limit: { type: 'numeric(12,2)', notNull: true },
    start_date: { type: 'date' },
    end_date: { type: 'date' },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  // REPORTS
  pgm.createTable('reports', {
    id: 'id',
    user_id: { type: 'integer', references: 'users', onDelete: 'CASCADE' },
    name: { type: 'varchar(100)' },
    filters: { type: 'jsonb', default: '{}' },
    total_income: { type: 'numeric(12,2)', default: 0 },
    total_expense: { type: 'numeric(12,2)', default: 0 },
    generated_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });
};

exports.down = pgm => {
  pgm.dropTable('reports');
  pgm.dropTable('budgets');
  pgm.dropTable('transactions');
  pgm.dropTable('categories');
  pgm.dropTable('accounts');
  pgm.dropTable('refresh_tokens');
  pgm.dropTable('api_keys');
  pgm.dropTable('users');
};
