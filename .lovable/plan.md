
# App de Prática de Idiomas com IA 🌍🗣️

## Visão Geral
Um app moderno de prática de idiomas com um robô de IA integrado via Lovable AI, suportando chat por texto, conversa por voz em tempo real e áudio gravado. Sem login, uso direto.

## Páginas e Fluxo

### 1. Tela Inicial / Configuração
- Seleção do idioma que o usuário quer praticar (Inglês, Espanhol, Francês, Alemão, Italiano, Japonês, etc.)
- Seleção do nível: Iniciante, Intermediário, Avançado
- Seleção de cenário temático: Restaurante, Aeroporto, Entrevista, Viagem, Dia a dia, Conversa livre
- Botão para iniciar conversa

### 2. Tela de Conversa (Principal)
- **Chat por texto**: Área de mensagens estilo chat com balões, input de texto, o robô responde no idioma escolhido com correções inline
- **Áudio gravado**: Botão para gravar áudio, enviar, e receber resposta em áudio (usando TTS do navegador)
- **Voz em tempo real**: Botão de "Chamada de voz" para conversa contínua por voz com o robô
- O robô corrige erros gramaticais, sugere alternativas, e explica regras
- Indicador visual do robô (avatar animado) mostrando quando está "ouvindo" ou "falando"
- Botão para trocar entre modos (texto/voz)

### 3. Histórico de Conversas
- Lista de conversas anteriores salvas no localStorage
- Possibilidade de revisitar e continuar conversas
- Filtro por idioma e cenário

## Funcionalidades do Robô IA
- Responde no idioma de prática, com traduções quando necessário
- Adapta vocabulário e complexidade ao nível selecionado
- Corrige erros com explicações curtas em português
- Faz perguntas para manter a conversa fluindo dentro do cenário escolhido
- Marca correções com destaque visual (vermelho/verde)

## Design e UX
- Interface moderna e limpa, estilo app de mensagens
- Tema escuro/claro
- Avatar animado do robô com estados visuais (pensando, falando, ouvindo)
- Design responsivo para mobile e desktop
- Transições suaves entre modos de conversa

## Backend
- Lovable Cloud com Edge Function para integração com Lovable AI (chat)
- Web Speech API do navegador para reconhecimento de voz (Speech-to-Text) e síntese de voz (Text-to-Speech)
- localStorage para salvar histórico de conversas sem necessidade de login
