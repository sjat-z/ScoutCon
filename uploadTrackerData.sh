#!/bin/bash
#clear

# Test if input is set correctly - else print guide
if [ -n "$3" ]; then
  echo -n "Uploading over SSH... "
else
  echo "Coordinates or file-number not set correct."
  echo "Usage: uploadTrackerData.sh X-coordinate Y-coordinate file-number."
  echo "Coordinates should be float numbers, i.e. 12.38475 or 55.002283847745."
  echo "File-number should be an integer number, i.e. 1 or 13."
  echo "Input is parsed untested at added to the GeoJSON-file, so think yourself a little about :)"
  exit
fi

ssh bumleweb sed -i 's/]}}]}/,['$1','$2']]}}]}/' /mnt/WEB/html/ScoutCon/data/scoutcon-tracker-$3.geojson
#echo "Updated scoutcon-tracker-$3.geojson-data on server:"
#ssh bumleweb cat /mnt/WEB/html/ScoutCon/data/scoutcon-tracker-$3.geojson
echo "done"