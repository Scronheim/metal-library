#!/bin/sh
echo "====== Сборка проекта ======" &&
vite build &&
echo "\e[31m====== Очистка директории перед заливкой ======\e[0m"
ssh scronheim@dark-corner.ru rm -rf /mnt/eft-helper/front/assets
echo "====== Заливка файлов ======"
scp -prq ./dist/* "scronheim@dark-corner.ru":/mnt/eft-helper/front &
echo "\e[32m====== Заливка файлов завершена ======\e[0m"
wait &&
echo "====== Удаление сборочных артефактов ======" &&
rm -r ./dist
