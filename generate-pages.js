import fs from 'fs';
import path from 'path';

const routes = {
  'ssc': 'SSCCorner',
  'hsc': 'HSCCorner',
  'admission': 'AdmissionCorner',
  'exam': 'ExamCenter',
  'verify-email': 'VerifyEmail',
  'verify-code': 'VerifyCode',
  'login': 'Login',
  'signup': 'SignUp',
  'forgot-password': 'ForgotPassword',
  'reset-password': 'ResetPassword',
  'forum': 'Forum',
  'post/[postId]': 'PostDetails',
  'create-post': 'CreatePost',
  'edit-post/[postId]': 'CreatePost',
  'profile': 'Profile',
  'profile/[userId]': 'Profile',
  'dashboard': 'Dashboard',
  'mistakes': 'Mistakes',
  'blocked-users': 'BlockedUsersPage',
};

for (const [routePath, componentName] of Object.entries(routes)) {
  const fullPath = path.join('./study-main/src/app', routePath);
  fs.mkdirSync(fullPath, { recursive: true });
  
  const relativeDepth = routePath.split('/').filter(Boolean).length;
  const importPath = '../'.repeat(relativeDepth + 1) + 'views/' + componentName;
  
  const content = `import ${componentName} from "${importPath}";\n\nexport default function Page() {\n  return <${componentName} />;\n}\n`;
  
  fs.writeFileSync(path.join(fullPath, 'page.tsx'), content);
  console.log(`Created ${fullPath}/page.tsx`);
}
