# Fix: Combobox não exibe o item selecionado no OSForm

## Problema

Após selecionar um cliente ou técnico no Combobox, o campo fica vazio porque `value` não é passado como prop. O input exibe `search || value || ""` — como `search` é limpo e `value` é undefined, fica em branco.

## Arquivos para modificar

### 1. `src/app/(auth)/ordens-servico/components/OSForm.tsx`

Adicionar estados para os labels selecionados:

```tsx
const [selectedCustomerLabel, setSelectedCustomerLabel] = useState("")
const [selectedTechnicianLabel, setSelectedTechnicianLabel] = useState("")
```

Passar `value` e atualizar `onSelect` no Combobox de **Cliente**:

```tsx
<Combobox
  placeholder="Buscar cliente por nome ou CPF..."
  value={selectedCustomerLabel}
  onSelect={(item) => {
    setField("customerId", item.value)
    setSelectedCustomerLabel(item.label)
  }}
  fetchItems={fetchCustomers}
/>
```

Passar `value` e atualizar `onSelect` no Combobox de **Técnico**:

```tsx
<Combobox
  placeholder="Buscar técnico..."
  value={selectedTechnicianLabel}
  onSelect={(item) => {
    setField("technicianId", item.value)
    setSelectedTechnicianLabel(item.label)
  }}
  fetchItems={fetchTechnicians}
/>
```

### 2. Nenhuma mudança no `Combobox.tsx`

O componente já renderiza `search || value || ""` no input (linha 87). Com `value` preenchido, o label aparecerá após a seleção.

## Teste manual

1. Abrir página "Nova OS"
2. Digitar nome de um cliente no campo Cliente
3. Clicar no resultado — o campo deve mostrar o nome + CPF do cliente selecionado
4. Repetir para o campo Técnico
5. Submeter o formulário e verificar se `customerId` e `technicianId` estão preenchidos
