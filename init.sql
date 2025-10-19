CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT
);

INSERT INTO contatos (nome, telefone, email) VALUES
('Wener Rodrigo', '16999999999', 'wener19.wr@gmail.com'),
('João Pedro', '1640028922','joao@2025.com.br');