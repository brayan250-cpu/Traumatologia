import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/components/CalendarAndSlots.tsx', 'utf8');

// Colores dark mode
c = c.replace(/text-\[#14201D\](\/\d+)?/g, (m) => {
  const opacity = m.match(/\/(\d+)/)?.[1];
  return opacity ? `[${'rgba(255,255,255,' + (parseInt(opacity)/100) + ')'}]` : 'white';
});
c = c.replace(/#0F5E52/g, '#00e6b4');
c = c.replace(/bg-white(?!\/)(\s|")/g, 'bg-[#ffffff]/5$1');
c = c.replace(/bg-\[#F7F8F7\]/g, 'bg-[#ffffff]/5');
c = c.replace(/bg-\[#00e6b4\]\/5/g, 'bg-[#00e6b4]/10');

// Labels de texto
c = c.replace(/text-\[rgba\(255,255,255,0\.\d+\)\]/g, '');

writeFileSync('src/components/CalendarAndSlots.tsx', c, 'utf8');

// Verificar rápido
const result = readFileSync('src/components/CalendarAndSlots.tsx', 'utf8');
const remaining = (result.match(/#14201D/g) || []).length;
console.log('Remaining #14201D:', remaining);
const teal = (result.match(/#00e6b4/g) || []).length;
console.log('New teal #00e6b4:', teal);
