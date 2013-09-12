<?php

if($height){
  $height = $height;
}else{
  $height=640;
}

?>
          <div id="slider_container" class="carousel slide">

              <a class="carousel_control left" href="#" id="prev"><img src="img/arrow-left.png"></a>
              <a class="carousel_control right" href="#" id="next"><img src="img/arrow-right.png"></a>

              <div class="slider_images carousel_inner" id="slider">
                    <img width="960" height="<?= $height ?>" src="http://placehold.it/960x<?= $height ?>" alt="" style="position: absolute; top: 0px; left: 0px; display: none; z-index: 7; opacity: 0; width: 960px; height: <?= $height ?>px;">
                    <img width="960" height="<?= $height ?>" src="http://placehold.it/960x<?= $height ?>/444/FFF" alt="" style="position: absolute; top: 0px; left: 0px; display: none; z-index: 7; opacity: 0; width: 960px; height: <?= $height ?>px;">
                    <img width="960" height="<?= $height ?>" src="http://placehold.it/960x<?= $height ?>" alt="" style="position: absolute; top: 0px; left: 0px; display: none; z-index: 7; opacity: 0; width: 960px; height: <?= $height ?>px;">
                    <img width="960" height="<?= $height ?>" src="http://placehold.it/960x<?= $height ?>/444/FFF" alt="" style="position: absolute; top: 0px; left: 0px; display: none; z-index: 7; opacity: 0; width: 960px; height: <?= $height ?>px;">
                    <img width="960" height="<?= $height ?>" src="http://placehold.it/960x<?= $height ?>" alt="" style="position: absolute; top: 0px; left: 0px; display: none; z-index: 7; opacity: 0; width: 960px; height: <?= $height ?>px;">
                    <img width="960" height="<?= $height ?>" src="http://placehold.it/960x<?= $height ?>/444/FFF" alt="" style="position: absolute; top: 0px; left: 0px; display: none; z-index: 7; opacity: 0; width: 960px; height: <?= $height ?>px;">
              </div> <!--/#slider -->
          </div><!--/#slider_container-->