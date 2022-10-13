import os
import shutil
from pathlib import Path
import subprocess

buildPath = "../swapper-build"
novoBuildPath = input("Where do you want to save the build? Default: '../swapper-build'")
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

print("This process may take a while...")
print("Building backend...")
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



print("Building frontend...")
subprocess.check_output('cmd /c "yarn --cwd ./frontend/ build"', shell=True)
shutil.copytree('./frontend/build',  buildPath + '/frontend')
# shutil.copyfile('./files-build/frontend/package.json',  buildPath + '/frontend/package.json')
# shutil.copyfile('./files-build/frontend/.env',  buildPath + '/frontend/example.env')
shutil.copyfile('./build_helper/serve.js', buildPath + '/frontend/serve.js')

# if(not os.path.isdir(buildPath + '/uploads')):
#   os.mkdir( buildPath + '/uploads')


# shutil.copytree('./files-build/certs', buildPath + '/certs')
# subprocess.check_output('cmd /c "git stash save --keep-index --include-untracked"', shell=True)
# subprocess.check_output('cmd /c "git stash drop"', shell=True)

print('Done! When deploying, remember to change the data in the .env file.')


# print(Path('C:/Git').relative_to('C:/Coisas'))
