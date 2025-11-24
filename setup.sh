#!/bin/bash

echo "🚀 Setup DearOutfit E-commerce"
echo "=============================="
echo ""

# Check if Node.js installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js belum terinstall!"
    echo "Install dari: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js terinstall: $(node --version)"
echo ""

# Check if MySQL installed
if ! command -v mysql &> /dev/null
then
    echo "⚠️  MySQL belum terinstall atau tidak ada di PATH"
    echo "Install dari: https://dev.mysql.com/downloads/mysql/"
    echo ""
    read -p "Lanjutkan tanpa setup database? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        exit 1
    fi
    SKIP_DB=true
else
    echo "✅ MySQL terinstall"
    SKIP_DB=false
fi

echo ""
echo "📦 Installing Node.js dependencies..."
npm install

if [ "$SKIP_DB" = false ]; then
    echo ""
    echo "🗄️  Setup MySQL Database"
    echo "========================"
    read -p "MySQL root password: " -s MYSQL_PASS
    echo ""
    
    mysql -u root -p"$MYSQL_PASS" < database.sql 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Database berhasil dibuat!"
    else
        echo "❌ Gagal membuat database. Cek password MySQL Anda."
        echo "Atau jalankan manual: mysql -u root -p < database.sql"
    fi
fi

echo ""
echo "✅ Setup selesai!"
echo ""
echo "📝 Cara menjalankan:"
echo "   npm start          # Jalankan dengan database"
echo "   Atau buka index.html di browser (tanpa database)"
echo ""
echo "🌐 Server akan berjalan di: http://localhost:3000"
echo "👤 Login Admin - Username: admin, Password: 12345"
