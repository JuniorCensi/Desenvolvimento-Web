# Caderno de Campo Digital - API Documentation

## 🎯 Backend CRUD + Autenticação ✅

### Endpoints Disponíveis:

#### 🔗 Base URL: `http://localhost:${PORT || 3001}`
Configure a porta pelo arquivo `.env` (variável `PORT`).
### 🔐 **Autenticação** (`/auth`)
- `POST /auth/registro` - Registrar novo usuário (retorna token)
- `POST /auth/login` - Login com email ou CPF + senha (retorna token)

O token JWT deve ser enviado no header:
`Authorization: Bearer <seu_token>`

Campos de usuário sensíveis (senha) não são retornados nas respostas.

---

---

### 👤 **Usuários** (`/usuarios`)
- `GET /usuarios` - Listar todos os usuários
- `POST /usuarios` - Criar novo usuário
- `GET /usuarios/:id` - Buscar usuário por ID
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Deletar usuário

---

### 🏷️ **Categorias** (`/categorias`)
- `GET /categorias` - Listar todas as categorias
- `POST /categorias` - Criar nova categoria
- `GET /categorias/:id` - Buscar categoria por ID
- `PUT /categorias/:id` - Atualizar categoria
- `DELETE /categorias/:id` - Deletar categoria

**Cores disponíveis:**
- `E39AFF` (uva)
- `FFD0A1` (pêssego)
- `FF9092` (ameixa)

---

### 📦 **Embalagens** (`/embalagens`)
- `GET /embalagens` - Listar todas as embalagens
- `POST /embalagens` - Criar nova embalagem
- `GET /embalagens/:id` - Buscar embalagem por ID
- `PUT /embalagens/:id` - Atualizar embalagem
- `DELETE /embalagens/:id` - Deletar embalagem

**Tamanhos disponíveis:** `PP`, `P`, `M`, `G`, `GG`

---

### 🌱 **Variedades** (`/variedades`)
- `GET /variedades` - Listar todas as variedades
- `POST /variedades` - Criar nova variedade
- `GET /variedades/:id` - Buscar variedade por ID
- `GET /variedades/categoria/:categoriaId` - Buscar por categoria
- `PUT /variedades/:id` - Atualizar variedade
- `DELETE /variedades/:id` - Deletar variedade

---

### 📋 **Itens** (`/itens`)
- `GET /itens` - Listar todos os itens
- `POST /itens` - Criar novo item
- `GET /itens/:id` - Buscar item por ID
- `GET /itens/variedade/:variedadeId` - Buscar por variedade
- `PUT /itens/:id` - Atualizar item
- `DELETE /itens/:id` - Deletar item

---

### 📊 **Estoque** (`/estoque`)
- `GET /estoque` - Listar todo o estoque
- `POST /estoque` - Adicionar item ao estoque
- `GET /estoque/:id` - Buscar item do estoque por ID
- `GET /estoque/baixo?limite=10` - Alertas de estoque baixo
- `PUT /estoque/:id` - Atualizar estoque
- `PATCH /estoque/:id/quantidade` - Atualizar apenas quantidade
- `DELETE /estoque/:id` - Remover do estoque

---

### 💰 **Vendas** (`/vendas`)
- `GET /vendas` - Listar todas as vendas
- `POST /vendas` - Realizar nova venda (atualiza estoque automaticamente)
- `GET /vendas/:id` - Buscar venda por ID
- `GET /vendas/relatorio?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD` - Relatório de vendas
- `PUT /vendas/:id` - Atualizar preço da venda
- `DELETE /vendas/:id` - Cancelar venda (devolve ao estoque)

---

## 🔥 **Funcionalidades Especiais Implementadas:**

1. **Validação completa** em todas as rotas
2. **Relacionamentos entre entidades** com populate automático
3. **Controle de estoque automático** nas vendas
4. **Alertas de estoque baixo**
5. **Relatórios de vendas** com filtros por data
6. **Cancelamento de vendas** com devolução ao estoque
7. **Tratamento de erros** centralizado (middleware `errorHandler`)
8. **Mensagens de sucesso/erro** padronizadas
9. **Hash seguro de senha** com `bcryptjs`
10. **Autenticação JWT** com expiração (8h)
11. **Porta configurável e CORS habilitado**

---

## 📝 **Exemplo de uso:**

### Criar uma categoria:
```json
POST /categorias
{
  "nome": "Frutas Vermelhas",
  "descricao": "Frutas de cor vermelha",
  "cor": "FF9092"
}
```

### Registro de usuário:
```json
POST /auth/registro
{
  "nome": "Maria Silva",
  "cpf": "12345678900",
  "telefoneCel": "(11) 98888-7777",
  "email": "maria@example.com",
  "senha": "segredo123",
  "endereco": [{
    "rua": "Rua A",
    "numero": "100",
    "cep": "12345-678",
    "bairro": "Centro",
    "cidade": "Cidade",
    "estado": "SP"
  }]
}
```

### Login:
```json
POST /auth/login
{
  "emailOuCpf": "maria@example.com",
  "senha": "segredo123"
}
```

### Realizar uma venda:
```json
POST /vendas
{
  "itemEmEstoque": "60f7b3b3b3b3b3b3b3b3b3b3",
  "quantidade": 5,
  "precoTotal": 25.50
}
```

---

## ✅ **Status Atual**

- ✅ CRUD completo para todas as entidades
- ✅ Validações implementadas
- ✅ Relacionamentos funcionando
- ✅ Controle de estoque automático
- ✅ Sistema de vendas com validações
- ✅ Relatórios e alertas
- ✅ Tratamento de erros e documentação atualizada
- ✅ Autenticação JWT e hash de senhas
