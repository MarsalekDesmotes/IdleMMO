@echo off
echo Supabase Veritabanı Guncelleme Araci
echo -------------------------------------
echo 1. Supabase'e giris yapiliyor (Tarayici acilacak)...
call npx supabase login

echo.
echo 2. Proje baglaniyor...
echo Veritabani sifrenizi isteyebilir: iqX9G7iJ5DzuS3Zw
call npx supabase link --project-ref ykkwnosxiusmvpvwnhjy

echo.
echo 3. Tablolar olusturuluyor (db push)...
call npx supabase db push

echo.
echo Islem tamamlandi!
pause
