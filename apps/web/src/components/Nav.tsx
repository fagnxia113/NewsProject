import {
  Badge,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from '@nextui-org/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useLocation } from 'react-router-dom';
import { appVersion } from '@web/utils/env';
import { useEffect, useState } from 'react';

const navbarItemLink = [
  {
    href: '/feeds',
    name: '公众号源',
  },
  {
    href: '/accounts',
    name: '账号管理',
  },
  {
    href: '/analysis/results',
    name: '分析结果',
  },
  {
    href: '/settings',
    name: '设置中心',
  },
];

const Nav = () => {
  const { pathname } = useLocation();
  const [releaseVersion, setReleaseVersion] = useState(appVersion);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/repos/cooderl/wewe-rss/releases/latest')
      .then((res) => res.json())
      .then((data) => {
        setReleaseVersion(data.name.replace('v', ''));
      });
  }, []);

  const isFoundNewVersion = releaseVersion > appVersion;
  console.log('isFoundNewVersion: ', isFoundNewVersion);

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <div>
      <Navbar 
        isBordered 
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="bg-gradient-to-r from-white/80 to-white/50 dark:from-gray-800/80 dark:to-gray-900/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        <Tooltip
          content={
            <div className="p-1">
              {isFoundNewVersion && (
                <Link
                  href={`https://github.com/cooderl/wewe-rss/releases/latest`}
                  target="_blank"
                  className="mb-1 block text-medium"
                >
                  发现新版本：v{releaseVersion}
                </Link>
              )}
              当前版本: v{appVersion}
            </div>
          }
          placement="left"
        >
          <NavbarBrand>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <p className="font-bold text-inherit bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">News</p>
            </Link>
            <Badge content={isFoundNewVersion ? 'New' : null} color="danger" variant="flat" size="sm" className="ml-2">
              <span className="text-xs text-gray-500">v{appVersion}</span>
            </Badge>
          </NavbarBrand>
        </Tooltip>
        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          {navbarItemLink.map((item) => {
            return (
              <NavbarItem
                isActive={isActive(item.href)}
                key={item.href}
              >
                <Link 
                  color="foreground" 
                  href={item.href}
                  className={`font-medium transition-colors ${isActive(item.href) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400'}`}
                >
                  {item.name}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
};

export default Nav;
