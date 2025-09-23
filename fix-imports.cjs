const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'components', 'ui');

// Mapeo de archivos a sus importaciones correctas
const fileMappings = {
  'alert-dialog.tsx': '@radix-ui/react-alert-dialog',
  'aspect-ratio.tsx': '@radix-ui/react-aspect-ratio',
  'breadcrumb.tsx': '@radix-ui/react-slot',
  'calendar.tsx': 'react-day-picker',
  'carousel.tsx': 'embla-carousel-react',
  'chart.tsx': 'recharts',
  'checkbox.tsx': '@radix-ui/react-checkbox',
  'collapsible.tsx': '@radix-ui/react-collapsible',
  'command.tsx': 'cmdk',
  'context-menu.tsx': '@radix-ui/react-context-menu',
  'dialog.tsx': '@radix-ui/react-dialog',
  'drawer.tsx': 'vaul',
  'dropdown-menu.tsx': '@radix-ui/react-dropdown-menu',
  'form.tsx': '@radix-ui/react-label',
  'hover-card.tsx': '@radix-ui/react-hover-card',
  'input-otp.tsx': 'input-otp',
  'menubar.tsx': '@radix-ui/react-menubar',
  'navigation-menu.tsx': '@radix-ui/react-navigation-menu',
  'pagination.tsx': 'lucide-react',
  'popover.tsx': '@radix-ui/react-popover',
  'progress.tsx': '@radix-ui/react-progress',
  'radio-group.tsx': '@radix-ui/react-radio-group',
  'resizable.tsx': 'react-resizable-panels',
  'scroll-area.tsx': '@radix-ui/react-scroll-area',
  'select.tsx': '@radix-ui/react-select',
  'separator.tsx': '@radix-ui/react-separator',
  'sheet.tsx': '@radix-ui/react-dialog',
  'sidebar.tsx': '@radix-ui/react-slot',
  'slider.tsx': '@radix-ui/react-slider',
  'sonner.tsx': 'next-themes',
  'switch.tsx': '@radix-ui/react-switch',
  'tabs.tsx': '@radix-ui/react-tabs',
  'toggle-group.tsx': '@radix-ui/react-toggle-group',
  'toggle.tsx': '@radix-ui/react-toggle',
  'tooltip.tsx': '@radix-ui/react-tooltip'
};

// Función para arreglar un archivo
function fixFile(filePath) {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  
  let fixedContent = content;
  
  // Arreglar importaciones de Radix UI
  fixedContent = fixedContent.replace(/@radix-ui\/react-\[^@\]\*/g, (match) => {
    const correctImport = fileMappings[fileName];
    if (correctImport && correctImport.startsWith('@radix-ui/')) {
      return correctImport;
    }
    return match;
  });
  
  // Arreglar otras importaciones problemáticas
  fixedContent = fixedContent.replace(/lucide-react@[0-9.]*"/g, 'lucide-react"');
  fixedContent = fixedContent.replace(/class-variance-authority@[0-9.]*"/g, 'class-variance-authority"');
  fixedContent = fixedContent.replace(/react-day-picker@[0-9.]*"/g, 'react-day-picker"');
  fixedContent = fixedContent.replace(/embla-carousel-react@[0-9.]*"/g, 'embla-carousel-react"');
  fixedContent = fixedContent.replace(/recharts@[0-9.]*"/g, 'recharts"');
  fixedContent = fixedContent.replace(/cmdk@[0-9.]*"/g, 'cmdk"');
  fixedContent = fixedContent.replace(/vaul@[0-9.]*"/g, 'vaul"');
  fixedContent = fixedContent.replace(/input-otp@[0-9.]*"/g, 'input-otp"');
  fixedContent = fixedContent.replace(/react-resizable-panels@[0-9.]*"/g, 'react-resizable-panels"');
  fixedContent = fixedContent.replace(/next-themes@[0-9.]*"/g, 'next-themes"');
  fixedContent = fixedContent.replace(/sonner@[0-9.]*"/g, 'sonner"');
  fixedContent = fixedContent.replace(/react-hook-form@[0-9.]*"/g, 'react-hook-form"');
  
  if (fixedContent !== content) {
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed: ${fileName}`);
  }
}

// Arreglar todos los archivos
const files = fs.readdirSync(uiDir).filter(file => file.endsWith('.tsx'));
files.forEach(file => {
  const filePath = path.join(uiDir, file);
  fixFile(filePath);
});

console.log('All files fixed!');
