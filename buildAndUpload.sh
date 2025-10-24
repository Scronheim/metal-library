#!/bin/sh
echo "====== Сборка проекта ======" &&
vite build &&
echo "\e[31m====== Очистка директории перед заливкой ======\e[0m"
ssh root@metal-library.ru rm -rf /srv/metal-library/front/assets
echo "====== Заливка файлов ======"
scp -prq ./dist/* "root@metal-library.ru":/srv/metal-library/front
echo "\e[32m====== Заливка файлов завершена ======\e[0m"
wait &&
echo "====== Удаление сборочных артефактов ======" &&
rm -r ./dist
