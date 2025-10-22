#!/bin/sh
echo "====== Сборка проекта ======" &&
vite build &&
echo "\e[31m====== Очистка директории перед заливкой ======\e[0m"
ssh scronheim@dark-corner.ru rm -rf /srv/metal-library/front/assets
echo "====== Заливка файлов ======"
scp -prq ./dist/* "root@64.188.73.107":/srv/metal-library/front
echo "\e[32m====== Заливка файлов завершена ======\e[0m"
wait &&
echo "====== Удаление сборочных артефактов ======" &&
rm -r ./dist
