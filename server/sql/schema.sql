CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id INTEGER NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  result VARCHAR(10) NOT NULL,

  difficulty VARCHAR(10) NOT NULL,

  completion_time INTEGER NOT NULL,

  completed_at TIMESTAMPTZ
    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_result
    CHECK (result IN ('Win', 'Loss')),

  CONSTRAINT valid_difficulty
    CHECK (
      difficulty IN ('easy', 'medium', 'hard')
    ),

  CONSTRAINT valid_completion_time
    CHECK (completion_time >= 0)
);