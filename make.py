import os
import shutil
from pathlib import Path
import subprocess


print("Atenção!")
print("Antes de rodar esse script, commite suas alterações para o Git")
print("Esse script é BRUTAL e VAI reverter todos os arquivos não commitados.")
comando = input("Deseja prosseguir? [s/n]")
if(comando != 's'):
  exit(0)

buildPath = "../saturnswap-build"
novoBuildPath = input("Qual o caminho para salvar a build? Padrão: '../saturnswap-build'")
if (novoBuildPath != ''):
  buildPath = novoBuildPath

if (not os.path.isdir(buildPath)):
  raise Exception("Caminho de build não existe.")

if(os.path.isdir(buildPath  + '/frontend')):
  shutil.rmtree(buildPath + '/frontend')

if(os.path.isdir(buildPath + '/backend')):
  shutil.rmtree(buildPath + '/backend')

# if(os.path.isdir(buildPath + '/certs')):
#   shutil.rmtree(buildPath + '/certs')

print("Esse processo pode demorar alguns minutos.")
print("Buildando backend...")
# if(os.path.isdir('./backend/src/shared')):
#   shutil.rmtree('./backend/src/shared')
# os.mkdir('./backend/src/shared')
# shutil.copytree('./shared/src', './backend/src/shared/src')

subprocess.check_output('cmd /c "yarn --cwd ./backend/ build"', shell=True)

### movo as coisas necessárias para a pasta de build

shutil.copytree('./backend/build',  buildPath + '/backend')
shutil.copyfile('./backend/example.env',  buildPath + '/backend/example.env')
shutil.copyfile('./backend/package.json',  buildPath + '/backend/package.json')
shutil.copyfile('./backend/ormconfig.js',  buildPath + '/backend/ormconfig.js')

with open( buildPath + '/backend/ormconfig.js', encoding='utf_8') as f:
  s = f.read()
s = s.replace("./src/db", './db')
s = s.replace("*.ts", '*.js')
with open( buildPath + '/backend/ormconfig.js', "w", encoding="utf_8") as f:
  f.write(s)



print("Buildando frontend...")
subprocess.check_output('cmd /c "yarn --cwd ./frontend/ build"', shell=True)
shutil.copytree('./frontend/build',  buildPath + '/frontend')
# shutil.copyfile('./files-build/frontend/package.json',  buildPath + '/frontend/package.json')
# shutil.copyfile('./files-build/frontend/.env',  buildPath + '/frontend/example.env')
shutil.copyfile('./build_helper/serve.js', buildPath + '/frontend/serve.js')

# if(not os.path.isdir(buildPath + '/uploads')):
#   os.mkdir( buildPath + '/uploads')


print("Finalizando build...")
# shutil.copytree('./files-build/certs', buildPath + '/certs')
# subprocess.check_output('cmd /c "git stash save --keep-index --include-untracked"', shell=True)
# subprocess.check_output('cmd /c "git stash drop"', shell=True)

print('Finalizado. Lembre-se de mudar os dados no arquivo .env')


# print(Path('C:/Git').relative_to('C:/Coisas'))
