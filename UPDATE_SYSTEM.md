# Sistema de Atualização Automática

Este documento explica como funciona o sistema de atualização automática do aplicativo.

## Como Funciona

O sistema possui **3 camadas de detecção de atualizações**:

### 1. Detecção por Versão (Mais Rápido)
- Cada build recebe um timestamp único no HTML (`<meta name="app-version">`)
- A cada 30 segundos, o app verifica se há uma nova versão no servidor
- Se detectar versão diferente, recarrega automaticamente
- **Tempo de detecção: até 30 segundos**

### 2. Service Worker Update
- Service Worker verifica atualizações a cada 30 segundos
- Quando detecta novo SW, aplica imediatamente
- Deleta automaticamente caches antigos
- **Tempo de detecção: até 30 segundos**

### 3. Cache Strategy
- O `index.html` NUNCA é cacheado (sempre busca do servidor)
- Arquivos JS/CSS usam "Network First" (tenta rede primeiro)
- Imagens usam cache agressivo para economizar dados
- Caches antigos são deletados automaticamente

## Comportamento Esperado

### Quando você faz deploy:
1. Usuário abre o app
2. Em até 30 segundos, uma das camadas detecta a atualização
3. App recarrega automaticamente
4. Nova versão é aplicada
5. Caches antigos são limpos automaticamente

### Primeira vez após o deploy anterior:
- Como o sistema de versão é novo, usuários podem precisar recarregar manualmente UMA vez
- Após isso, todas as atualizações futuras serão automáticas

## Troubleshooting

### Se o app ainda ficar com tela preta:

1. **Limpar tudo de uma vez:**
   ```
   Acesse: seu-dominio.com/clear-cache.html
   Clique em "Limpar Tudo e Recarregar"
   ```

2. **Ou manualmente no navegador:**
   - Chrome/Edge: `Ctrl+Shift+Del` (Windows) ou `Cmd+Shift+Del` (Mac)
   - Selecione "Imagens e arquivos em cache"
   - Clique em "Limpar dados"

3. **Forçar recarregamento:**
   - `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)

## Para Desenvolvedores

### Incrementar versão do cache:
Se precisar forçar limpeza de cache, edite `/public/sw.js`:
```javascript
const CACHE_VERSION = 'v6'; // incrementar este número
```

### Desabilitar Service Worker temporariamente:
No navegador:
1. Abra DevTools (F12)
2. Aba "Application" → "Service Workers"
3. Clique em "Unregister"

### Testar atualizações localmente:
1. Faça `npm run build`
2. Abra o app
3. Faça outra alteração e `npm run build`
4. Aguarde 30 segundos
5. O app deve recarregar automaticamente

## Logs no Console

O sistema gera logs úteis no console:
- `[Update] Nova versão detectada. Atualizando...` - Detecção por versão
- `[SW] Installing new version...` - Service Worker instalando
- `[SW] Activating new version...` - Service Worker ativando
- `[SW] Deleting old cache: ...` - Limpando caches antigos
- `[SW] New version activated!` - Nova versão ativa

## Vantagens

✅ Atualizações automáticas sem ação do usuário
✅ Múltiplas camadas de detecção (redundância)
✅ Limpeza automática de caches antigos
✅ Economia de dados (imagens em cache)
✅ Funciona offline (com cache)
✅ Detecção rápida (30 segundos)
✅ Sem tela preta após atualizações

## Importante

- A primeira atualização após este deploy pode exigir reload manual
- Todas as atualizações futuras serão 100% automáticas
- O sistema é resiliente: se uma camada falhar, outras detectam
- Imagens permanecem em cache para economizar dados
