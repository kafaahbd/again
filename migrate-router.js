import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory()
        ? walkSync(dirFile, filelist)
        : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'EACCES') {
        console.log(`Skipping ${dirFile}`);
      } else {
        throw err;
      }
    }
  });
  return filelist;
};

const files = walkSync('./study-main/src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('react-router-dom')) {
    changed = true;
    
    // Replace Link
    if (content.includes('import { Link')) {
      content = content.replace(/import\s+\{([^}]*)\bLink\b([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
        const otherImports = [p1, p2].join('').split(',').map(s => s.trim()).filter(Boolean);
        let res = `import Link from "next/link";\n`;
        if (otherImports.length > 0) {
          res += `import { ${otherImports.join(', ')} } from "react-router-dom";`;
        }
        return res;
      });
      // Replace <Link to= with <Link href=
      content = content.replace(/<Link([^>]*?)to=/g, '<Link$1href=');
    }

    // Replace useNavigate
    if (content.includes('useNavigate')) {
      content = content.replace(/useNavigate/g, 'useRouter');
      content = content.replace(/import\s+\{([^}]*)\buseRouter\b([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
        const otherImports = [p1, p2].join('').split(',').map(s => s.trim()).filter(Boolean);
        let res = `import { useRouter } from "next/navigation";\n`;
        if (otherImports.length > 0) {
          res += `import { ${otherImports.join(', ')} } from "react-router-dom";`;
        }
        return res;
      });
    }

    // Replace useLocation
    if (content.includes('useLocation')) {
      content = content.replace(/useLocation/g, 'usePathname');
      content = content.replace(/import\s+\{([^}]*)\busePathname\b([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
        const otherImports = [p1, p2].join('').split(',').map(s => s.trim()).filter(Boolean);
        let res = `import { usePathname } from "next/navigation";\n`;
        if (otherImports.length > 0) {
          res += `import { ${otherImports.join(', ')} } from "react-router-dom";`;
        }
        return res;
      });
      // useLocation().pathname -> usePathname()
      content = content.replace(/const\s+(\w+)\s*=\s*usePathname\(\);\s*\n\s*.*?\1\.pathname/g, 'const $1 = usePathname();\n$1');
      content = content.replace(/location\.pathname/g, 'pathname');
    }

    // Replace useParams
    if (content.includes('useParams')) {
      content = content.replace(/import\s+\{([^}]*)\buseParams\b([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
        const otherImports = [p1, p2].join('').split(',').map(s => s.trim()).filter(Boolean);
        let res = `import { useParams } from "next/navigation";\n`;
        if (otherImports.length > 0) {
          res += `import { ${otherImports.join(', ')} } from "react-router-dom";`;
        }
        return res;
      });
    }

    // Replace useSearchParams
    if (content.includes('useSearchParams')) {
      content = content.replace(/import\s+\{([^}]*)\buseSearchParams\b([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
        const otherImports = [p1, p2].join('').split(',').map(s => s.trim()).filter(Boolean);
        let res = `import { useSearchParams } from "next/navigation";\n`;
        if (otherImports.length > 0) {
          res += `import { ${otherImports.join(', ')} } from "react-router-dom";`;
        }
        return res;
      });
    }

    // Cleanup empty react-router-dom imports
    content = content.replace(/import\s+\{\s*\}\s+from\s+['"]react-router-dom['"];?\n/g, '');
    
    // Add "use client" if it uses hooks
    if ((content.includes('useRouter') || content.includes('usePathname') || content.includes('useParams') || content.includes('useSearchParams')) && !content.includes('"use client"')) {
      content = '"use client";\n' + content;
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
