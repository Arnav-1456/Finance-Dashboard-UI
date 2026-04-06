export const categories = [
  { id: 'cat_1', label: 'Food & Dining', color: 'bg-accent-amber text-accent-amber', hex: '#F59E0B' },
  { id: 'cat_2', label: 'Salary', color: 'bg-status-success text-status-success', hex: '#10B981' },
  { id: 'cat_3', label: 'Transport', color: 'bg-accent-blue text-accent-blue', hex: '#3B82F6' },
  { id: 'cat_4', label: 'Shopping', color: 'bg-accent-purple text-accent-purple', hex: '#A855F7' },
  { id: 'cat_5', label: 'Rent & Bills', color: 'bg-accent-rose text-accent-rose', hex: '#F43F5E' },
  { id: 'cat_6', label: 'Freelance', color: 'bg-accent-teal text-accent-teal', hex: '#00D4AA' },
  { id: 'cat_7', label: 'Entertainment', color: 'bg-accent-indigo text-accent-indigo', hex: '#6366F1' },
  { id: 'cat_8', label: 'Other', color: 'bg-text-secondary text-text-secondary', hex: '#8B8FA3' }
];

export const getCategoryByLabel = (label) => categories.find(c => c.label === label) || categories[7];
