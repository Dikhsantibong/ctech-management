import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
    const [lang, setLang] = useState('id');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_lang');
        if (savedLang) {
            setLang(savedLang);
        } else {
            localStorage.setItem('app_lang', 'id');
        }
    }, []);

    const handleLanguageChange = (newLang: string) => {
        setLang(newLang);
        localStorage.setItem('app_lang', newLang);
        // Note: Full translation implementation would reload the page or update i18n context here
        // window.location.reload(); 
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange('id')} className={lang === 'id' ? 'font-bold bg-muted' : ''}>
                    Indonesia (ID)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className={lang === 'en' ? 'font-bold bg-muted' : ''}>
                    English (EN)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
