<?php  
  $messageSuccess = '';
  $messageError = '';

  // TEST
  // show php error verbatime (file permits etc.) remove on deployment.
  ini_set('display_errors', 1);

  if(isset($_POST["submit"])) {  
    if(empty($_POST["xCoordinate"])) {
      $messageError = "<label class='text-danger'>Tilføj X-koordinat.</label>";  
    }  
    else if(empty($_POST["yCoordinate"])) {
      $messageError = "<label class='text-danger'>Tilføj Y-koordinat.</label>";  
    }  
    // else if(empty($_POST["updateTimestamp"])) {
    //   $messageError = "<label class='text-danger'>Tilføj dato og tid.</label>";  
    // }
    else {
      if(file_exists('data/scoutcon-tracker-1.geojson')) {  
        // open in read mode and echo origional
        $activeTrackerFilePath = "data/scoutcon-tracker-1.geojson";
        $activeTrackerFile = fopen($activeTrackerFilePath, 'r') or die("Unable to open file in read mode.");
          $activeTrackerFileContent = fread($activeTrackerFile, filesize($activeTrackerFilePath));
          $regEx = '/]}}]}/m';
          $subst = ',[' . $_POST["xCoordinate"] . ',' . $_POST["yCoordinate"] . ']]}}]}';
          $newTrackerFile = preg_replace($regEx, $subst, $activeTrackerFileContent);
        fclose($activeTrackerFile);

        // open in write mode to overwrite complete file
        $activeTrackerFile = fopen($activeTrackerFilePath, 'w') or die("Unable to open file in write mode.");
          fwrite($activeTrackerFile, $newTrackerFile);
        fclose($activeTrackerFile);
      }  
      else {  
        $messageError = 'relevant file does not exit.';  
      }  
    }  
  }  
?>

<!DOCTYPE html>  
<html>  
  <head>  
    <title>geoJSON updater</title>
  </head>  
  <body>
    <div class="container" style="width:500px;">               
      <form method="post">  
        <?php   
        if(isset($messageError)) {  
          echo $messageError;
        }
        ?>  
        <div style="margin:10px;">
          <label>X-koordinat:&nbsp;</label><input type="text" name="xCoordinate" style="width:200px; float:right;" />
        </div> 
        <div style="margin:10px;">
          <label>Y-koordinat:&nbsp;</label><input type="text" name="yCoordinate" style="width:200px; float:right;" />
        </div>

        <!-- <label>Dato og tid</label>  
        <input type="text" xCoordinate="updateTimestamp" /><br />   -->
        <input type="submit" name="submit" value="Tilføj position" /><br />                      
        <?php  
        if(isset($messageSuccess)) {  
          echo $messageSuccess;  
        }  
        ?>  
      </form>  
    </div>
  </body>  
</html> 