@echo off
echo Setting up physician-order feature directory structure...

REM Create directories
mkdir client\src\features\physician-order\components
mkdir client\src\features\physician-order\hooks
mkdir client\src\features\physician-order\types
mkdir client\src\features\physician-order\utils
mkdir client\src\features\physician-order\services

REM Create index.ts files
echo. > client\src\features\physician-order\index.ts
echo. > client\src\features\physician-order\components\index.ts
echo. > client\src\features\physician-order\hooks\index.ts
echo. > client\src\features\physician-order\types\index.ts
echo. > client\src\features\physician-order\utils\index.ts
echo. > client\src\features\physician-order\services\index.ts

REM Create types file
echo export interface Patient {
echo   id: number;
echo   name: string;
echo   dob: string;
echo   mrn?: string;
echo   pidn?: string;
echo   age?: number;
echo   gender?: string;
echo } > client\src\features\physician-order\types\patient-types.ts

echo Directory structure setup complete!