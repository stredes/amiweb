#!/bin/bash

# Script para crear usuarios en Firebase Authentication
# Uso: ./create-users.sh

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Cargar API_KEY desde .env
if [ -f .env ]; then
  export $(cat .env | grep VITE_FIREBASE_API_KEY | xargs)
else
  echo -e "${RED}❌ Error: Archivo .env no encontrado${NC}"
  exit 1
fi

if [ -z "$VITE_FIREBASE_API_KEY" ]; then
  echo -e "${RED}❌ Error: VITE_FIREBASE_API_KEY no encontrada en .env${NC}"
  exit 1
fi

API_KEY=$VITE_FIREBASE_API_KEY
API_URL="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY"

echo -e "${BLUE}🔧 Creando usuarios en Firebase Authentication...${NC}\n"

# Array de usuarios
declare -a USERS=(
  "root@amilab.com:root2026:Desarrollador Web:Root"
  "admin@amilab.com:admin123:Roberto Silva:Admin"
  "vendedor1@amilab.com:vende123:Carlos Ramírez:Vendedor"
  "vendedor2@amilab.com:vende123:Ana Torres:Vendedor"
  "socio@amilab.com:demo123:Juan Pérez:Socio"
)

created=0
existing=0
failed=0

# Crear cada usuario
for user_data in "${USERS[@]}"; do
  IFS=':' read -r email password displayName role <<< "$user_data"
  
  echo -e "${YELLOW}➤ Creando: $email ($role)...${NC}"
  
  response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\",\"displayName\":\"$displayName\",\"returnSecureToken\":true}")
  
  if echo "$response" | grep -q "idToken"; then
    echo -e "${GREEN}✅ Usuario creado exitosamente${NC}"
    uid=$(echo "$response" | grep -o '"localId":"[^"]*' | cut -d'"' -f4)
    echo -e "   UID: $uid"
    ((created++))
  elif echo "$response" | grep -q "EMAIL_EXISTS"; then
    echo -e "${GREEN}✓  Usuario ya existe${NC}"
    ((existing++))
  elif echo "$response" | grep -q "CONFIGURATION_NOT_FOUND"; then
    echo -e "${RED}❌ ERROR: Email/Password no habilitado en Firebase${NC}"
    echo -e "${YELLOW}   👉 Habilita Email/Password en:${NC}"
    echo -e "   https://console.firebase.google.com/project/amiweb-895d7/authentication/providers"
    exit 1
  else
    echo -e "${RED}❌ Error: $(echo $response | grep -o '"message":"[^"]*' | cut -d'"' -f4)${NC}"
    ((failed++))
  fi
  
  echo ""
  sleep 0.5
done

# Resumen
echo "=========================================="
echo -e "${BLUE}📊 Resumen:${NC}"
echo -e "   ${GREEN}✅ Creados: $created${NC}"
echo -e "   ${GREEN}✓  Ya existían: $existing${NC}"
if [ $failed -gt 0 ]; then
  echo -e "   ${RED}❌ Fallos: $failed${NC}"
fi
echo "=========================================="

if [ $created -gt 0 ] || [ $existing -eq ${#USERS[@]} ]; then
  echo -e "\n${GREEN}✅ ¡Proceso completado exitosamente!${NC}\n"
  echo -e "${BLUE}🚀 Próximos pasos:${NC}"
  echo "   1. npm run dev"
  echo "   2. Ve a http://localhost:5173/login"
  echo ""
  echo -e "${BLUE}📝 Credenciales disponibles:${NC}"
  for user_data in "${USERS[@]}"; do
    IFS=':' read -r email password displayName role <<< "$user_data"
    echo "   • $email / $password ($role)"
  done
  echo ""
else
  echo -e "\n${RED}⚠️  Algunos usuarios no se pudieron crear${NC}"
  exit 1
fi
