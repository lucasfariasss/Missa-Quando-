# Missa JP Finder

Uma aplicação web para encontrar horários de missas, confissões e adorações nas paróquias e capelas de João Pessoa. O sistema conta com uma área pública de consultas rápidas e um portal administrativo robusto com controle de acesso (RBAC).

## Arquitetura do Projeto

O projeto é construído em uma stack moderna e serverless:
- **Frontend**: React (Vite) + TypeScript
- **Estilização e Componentes**: Tailwind CSS + shadcn-ui + lucide-react
- **Backend / Database / Auth**: Supabase

### Estrutura de Rotas
- **`/` (Pública)**: A página inicial (`Index.tsx`) exibe todos os horários e informações. Possui filtros instantâneos por Zona (Sul, Norte, Leste, Oeste) e busca textual por nome da igreja ou bairro.
- **`/admin-login` (Pública)**: Tela de login exclusiva para administradores.
- **`/admin-portal` (Protegida)**: Painel de gestão restrito por autenticação e perfil do usuário do Supabase.

### RBAC e Modelagem de Dados

O banco de dados relacional (PostgreSQL via Supabase) substituiu a antiga planilha estática de horários. A arquitetura de dados e perfis funciona da seguinte forma:

1. **`churches`**: Tabela *flat* que armazena os dados primários de cada paróquia (nome, bairro, zona, contatos, instagram e os 21 slots de horários de missa/confissão/adoração para os 7 dias da semana).
2. **`profiles`**: Tabela vinculada aos usuários autenticados (Auth do Supabase) que controla os níveis de acesso através da coluna `role`.
3. **`church_editors`**: Tabela associativa que vincula um usuário (editor) a uma ou mais igrejas específicas (delegações).

#### Regras de Negócio do Painel Administrativo

O `AdminPortal` consome a `role` do usuário logado na inicialização e gerencia a interface dinamicamente:
- **Super Admin (`super_admin`)**: Tem visão e acesso incondicional. Esse perfil pode visualizar e alterar os campos de *todas* as igrejas da base de dados. Além disso, pode usar a função *Delegar* para fornecer acesso individual de uma paróquia específica para contas de editores.
- **Editor (`editor`)**: Tem visão restrita. A query da dashboard cruza seu `id` com a tabela `church_editors`. Assim, esse perfil apenas enxerga os cards das paróquias que lhe foram concedidas. Um administrador da "Capela São Francisco", por exemplo, não sabe quais outras igrejas existem na base e só consegue alterar os horários da sua própria comunidade.

### Segurança (RLS - Row Level Security)
As políticas (Policies) nativas do Supabase garantem que a tabela principal de dados `churches` seja de leitura pública para qualquer visitante do site, enquanto as inserções, atualizações e operações nas tabelas `profiles` e `church_editors` ficam firmemente trancadas apenas para os usuários autenticados que passam nas validações.

## Executando o Projeto

```sh
# Instale as dependências
npm install

# Inicie o servidor local
npm run dev
```

> **Aviso de Migração:** A dependência da leitura de arquivos locais foi removida do frontend na versão atual, o antigo arquivo `/public/data/horarios.xlsx` e as bibliotecas de parser de planilhas foram removidas em prol da integração direta com banco de dados via `@supabase/supabase-js`.
