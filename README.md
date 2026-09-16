# OrçaPro

Sistema web para criação, gerenciamento e geração de orçamentos profissionais.

O **OrçaPro** é uma aplicação web desenvolvida com foco em pequenos negócios e profissionais que precisam organizar seus orçamentos de forma simples, prática e profissional.

A aplicação permite cadastrar clientes e materiais, criar e gerenciar orçamentos, acompanhar seus status e gerar documentos em PDF diretamente pelo navegador.

---

## 📖 Sobre o projeto

O OrçaPro nasceu como um projeto prático de desenvolvimento web com o objetivo de transformar uma necessidade comum de pequenos negócios — a criação e organização de orçamentos — em uma aplicação simples e funcional.

A proposta foi desenvolver uma interface intuitiva, com navegação clara e funcionalidades suficientes para permitir que o usuário consiga:

- Cadastrar seus clientes;
- Cadastrar materiais e produtos;
- Criar novos orçamentos;
- Adicionar produtos e serviços aos orçamentos;
- Calcular automaticamente os valores;
- Editar informações;
- Consultar orçamentos existentes;
- Filtrar e pesquisar registros;
- Visualizar os detalhes de cada orçamento;
- Gerar um documento PDF profissional.

O projeto foi desenvolvido inicialmente utilizando armazenamento local no navegador, permitindo que toda a aplicação funcione sem a necessidade de um servidor backend ou banco de dados.

---

## 🎯 Objetivo

O principal objetivo do OrçaPro é oferecer uma solução simples para organização e criação de orçamentos, ao mesmo tempo em que serve como projeto prático para aplicação de conceitos de desenvolvimento web.

Durante o desenvolvimento foram aplicados conceitos como:

- Estruturação semântica com HTML5;
- Estilização e responsividade com CSS3;
- Manipulação do DOM com JavaScript;
- Eventos e interações com o usuário;
- CRUD de informações;
- Persistência de dados com LocalStorage;
- Validação de formulários;
- Cálculos dinâmicos;
- Geração de documentos PDF;
- Organização modular de arquivos;
- Boas práticas de estruturação de projetos.

---

## ✨ Funcionalidades

### 📊 Dashboard

O sistema possui um dashboard para apresentar uma visão geral dos orçamentos cadastrados.

Entre as informações disponíveis estão:

- Total de orçamentos;
- Orçamentos em aberto;
- Orçamentos aprovados;
- Valor total dos orçamentos;
- Lista de orçamentos recentes.

---

### 🧾 Gerenciamento de orçamentos

O módulo de orçamentos permite:

- Criar novos orçamentos;
- Editar orçamentos existentes;
- Excluir orçamentos;
- Visualizar detalhes;
- Pesquisar por cliente;
- Pesquisar pelo número do orçamento;
- Filtrar por status;
- Adicionar múltiplos itens;
- Alterar quantidade;
- Alterar valor unitário;
- Calcular subtotais automaticamente;
- Calcular o valor total automaticamente.

Cada orçamento possui informações como:

- Número;
- Cliente;
- Data;
- Status;
- Produtos ou serviços;
- Quantidades;
- Valores unitários;
- Subtotais;
- Valor total.

---

### 👥 Gerenciamento de clientes

O módulo de clientes permite cadastrar e gerenciar informações dos clientes utilizados nos orçamentos.

Os dados armazenados incluem:

- Nome;
- Telefone;
- E-mail;
- Cidade;
- Estado;
- Endereço;
- Observações.

---

### 📦 Gerenciamento de materiais

O módulo de materiais permite cadastrar produtos e materiais que podem posteriormente ser utilizados na composição dos orçamentos.

Cada material possui informações como:

- Nome;
- Categoria;
- Unidade;
- Preço.

Ao selecionar um material durante a criação de um orçamento, o sistema utiliza automaticamente seu preço cadastrado como valor unitário.

---

### 🧮 Cálculo automático

Os valores dos orçamentos são calculados automaticamente conforme os itens são adicionados ou alterados.

O cálculo segue a lógica:

**Subtotal = Quantidade × Valor unitário**

E o total do orçamento é calculado a partir da soma dos subtotais dos itens.

Isso permite alterar quantidades e valores durante a criação do orçamento sem necessidade de realizar cálculos manualmente.

---

### 👁️ Visualização de orçamento

O sistema possui uma tela de visualização detalhada de cada orçamento.

Nela são apresentados:

- Número do orçamento;
- Cliente;
- Data;
- Valor;
- Status;
- Lista de itens;
- Quantidades;
- Valores unitários;
- Subtotais;
- Total final.

---

### 📄 Geração de PDF

O OrçaPro possui geração de PDF diretamente pelo navegador.

A partir da visualização de um orçamento, o usuário pode selecionar **Gerar PDF** e obter um documento contendo:

- Identificação do OrçaPro;
- Número do orçamento;
- Data;
- Cliente;
- Status;
- Produtos e serviços;
- Quantidades;
- Valores unitários;
- Subtotais;
- Valor total.

A geração dos documentos utiliza:

- **jsPDF**
- **jsPDF AutoTable**

---

## 💾 Armazenamento de dados

Nesta primeira versão, o OrçaPro utiliza o **LocalStorage** do navegador para persistência dos dados.

São armazenadas informações referentes a:

- Orçamentos;
- Clientes;
- Materiais.

Isso permite que o sistema funcione sem backend e sem banco de dados.

Os dados permanecem armazenados no navegador utilizado pelo usuário.

---

## 🛠️ Tecnologias utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript

### Armazenamento

- LocalStorage

### Geração de documentos

- jsPDF
- jsPDF AutoTable

### Desenvolvimento

- Visual Studio Code
- Git
- GitHub

---

## 📁 Estrutura do projeto

```text
OrcaPro/
│
├── assets/
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── clientes.js
│   ├── materiais.js
│   └── orcamentos.js
│
├── index.html
├── orcamentos.html
├── clientes.html
├── materiais.html
│
├── README.md
└── .gitignore
```

---

## 🧩 Organização dos módulos

O projeto foi dividido em módulos para facilitar a manutenção e evolução da aplicação.

### `app.js`

Responsável pelas funcionalidades relacionadas ao dashboard e comportamentos gerais da aplicação.

### `orcamentos.js`

Responsável pelo gerenciamento dos orçamentos, incluindo:

- Criação;
- Edição;
- Exclusão;
- Busca;
- Filtros;
- Cálculos;
- Visualização;
- Geração de PDF.

### `clientes.js`

Responsável pelo cadastro, edição, exclusão e gerenciamento dos clientes.

### `materiais.js`

Responsável pelo cadastro, edição, exclusão e gerenciamento dos materiais.

### `style.css`

Responsável pela identidade visual, layout, componentes, responsividade e estilos gerais da aplicação.

---

## 🚀 Como executar

O projeto não necessita de instalação de dependências ou configuração de servidor backend.

### 1. Clone o repositório

```bash
git clone https://github.com/amandagborgess/OrcaPro.git
```

### 2. Entre na pasta do projeto

```bash
cd OrcaPro
```

### 3. Execute a aplicação

Abra o arquivo:

```text
index.html
```

diretamente no navegador.

Durante o desenvolvimento, também é possível utilizar a extensão **Live Server** no Visual Studio Code.

---

## 🌐 Funcionamento

O OrçaPro é uma aplicação front-end e, nesta versão, não depende de uma API ou banco de dados externo.

O fluxo principal da aplicação é:

```text
Dashboard
    ↓
Clientes
    ↓
Materiais
    ↓
Novo orçamento
    ↓
Adicionar itens
    ↓
Cálculo automático
    ↓
Salvar orçamento
    ↓
Visualizar orçamento
    ↓
Gerar PDF
```

---

## 📄 Exemplo de fluxo de utilização

Um fluxo básico de utilização do sistema pode ser realizado da seguinte forma:

1. Cadastrar um cliente;
2. Cadastrar os materiais ou produtos;
3. Criar um novo orçamento;
4. Selecionar o cliente;
5. Adicionar os produtos ou serviços;
6. Definir as quantidades;
7. Conferir os valores;
8. Salvar o orçamento;
9. Visualizar os detalhes;
10. Gerar o PDF.

---

## 🔐 Segurança e limitações atuais

Por utilizar LocalStorage, esta versão possui algumas limitações naturais.

Os dados ficam armazenados localmente no navegador e não são sincronizados entre diferentes dispositivos.

Além disso, a aplicação ainda não possui:

- Sistema de autenticação;
- Banco de dados;
- Backend;
- Controle de usuários;
- Sincronização em nuvem;
- Controle de permissões.

Essas limitações fazem parte da proposta da primeira versão e podem ser solucionadas em futuras versões.

---

## 🔮 Próximas evoluções

O projeto possui uma base preparada para receber novas funcionalidades.

Entre as possíveis evoluções estão:

- [ ] Sistema de autenticação
- [ ] Banco de dados
- [ ] Backend
- [ ] Cadastro de empresas
- [ ] Perfis de usuários
- [ ] Controle de permissões
- [ ] Sincronização em nuvem
- [ ] Personalização do PDF
- [ ] Logo da empresa no orçamento
- [ ] Dados da empresa no documento
- [ ] Validade do orçamento
- [ ] Condições de pagamento
- [ ] Observações no orçamento
- [ ] Assinatura digital
- [ ] Envio de orçamento por WhatsApp
- [ ] Histórico de alterações
- [ ] Dashboard com métricas financeiras
- [ ] Relatórios
- [ ] Exportação de dados
- [ ] Deploy online

---

## 📸 Preview

Screenshots da aplicação podem ser adicionados futuramente para apresentar visualmente as principais telas do sistema.

Algumas telas que podem ser apresentadas:

- Dashboard;
- Gerenciamento de orçamentos;
- Cadastro de clientes;
- Cadastro de materiais;
- Visualização de orçamento;
- PDF gerado.

---

## 📚 Aprendizados

O desenvolvimento do OrçaPro proporcionou a aplicação prática de conceitos importantes de desenvolvimento web, principalmente relacionados à construção de uma aplicação front-end completa.

Entre os principais aprendizados estão:

- Organização de projetos;
- Separação de responsabilidades;
- Manipulação do DOM;
- Eventos JavaScript;
- Formulários;
- Validação de dados;
- CRUD;
- LocalStorage;
- Manipulação de arrays e objetos;
- Cálculos dinâmicos;
- Geração de arquivos PDF;
- Responsividade;
- Acessibilidade básica;
- Versionamento com Git;
- Organização de repositórios no GitHub.

---

## 📌 Status do projeto

**v1.0.0 — Primeira versão funcional**

O OrçaPro encontra-se funcional e possui os principais fluxos implementados:

- Dashboard;
- Clientes;
- Materiais;
- Orçamentos;
- Busca;
- Filtros;
- Cálculos automáticos;
- Visualização;
- Geração de PDF;
- Persistência com LocalStorage.

O projeto permanece aberto para futuras evoluções e integrações.

---

## 👩‍💻 Desenvolvido por

**Amanda Borges**

Projeto desenvolvido para fins de estudo, portfólio e evolução profissional em desenvolvimento de software.

---

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo e portfólio.

Caso o projeto seja utilizado ou adaptado para fins comerciais, recomenda-se verificar previamente os direitos de uso das bibliotecas e recursos de terceiros utilizados.

---

## ⭐ Contribuições

Este projeto foi desenvolvido como um projeto individual de estudo e portfólio.

Sugestões, melhorias e ideias para futuras versões são bem-vindas.
