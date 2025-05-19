'use strict';

/**
 * File modal view controller.
 */
angular.module('docs').controller('FileModalView', function ($http,$uibModalInstance, $scope, $state, $stateParams, $sce, Restangular, $transitions,$uibModal) {
  var setFile = function (files) {
    // Search current file
    _.each(files, function (value) {
      if (value.id === $stateParams.fileId) {
        $scope.file = value;
        $scope.trustedFileUrl = $sce.trustAsResourceUrl('../api/file/' + $stateParams.fileId + '/data');
      }
    });
  };

  // 新增方法：检查是否是图片文件
  $scope.isImage = function() {
    return $scope.file && $scope.file.mimetype.startsWith('image/');
  };

  // 在控制器中添加以下代码
  $scope.isEditingImage = false;
  $scope.isCropping = false;
  let canvas, ctx;
  let imageElement;
  let cropStartX, cropStartY;
  let cropWidth, cropHeight;

  $scope.initImageEditor = function() {
    $scope.isEditingImage = true;

    // 初始化Canvas
    setTimeout(() => {
      canvas = document.getElementById('imageEditorCanvas');
      ctx = canvas.getContext('2d');

      // 加载原始图片
      imageElement = new Image();
      imageElement.crossOrigin = "anonymous";
      imageElement.src = `../api/file/${$stateParams.fileId}/data`;

      imageElement.onload = () => {
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        ctx.drawImage(imageElement, 0, 0);

        // 添加交互事件
        canvas.addEventListener('mousedown', startCrop);
        canvas.addEventListener('mousemove', updateCrop);
        canvas.addEventListener('mouseup', endCrop);
      };
    }, 0);
  };

  function startCrop(e) {
    $scope.isCropping = true;
    const rect = canvas.getBoundingClientRect();
    cropStartX = e.clientX - rect.left;
    cropStartY = e.clientY - rect.top;
  }

  function updateCrop(e) {
    if (!$scope.isCropping) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    cropWidth = currentX - cropStartX;
    cropHeight = currentY - cropStartY;

    // 重绘Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageElement, 0, 0);

    // 绘制裁剪框
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropStartX, cropStartY, cropWidth, cropHeight);
  }

  function endCrop() {
    $scope.isCropping = false;
  }

  $scope.applyCrop = function() {
    const croppedImage = ctx.getImageData(cropStartX, cropStartY, cropWidth, cropHeight);

    // 创建临时Canvas保存裁剪结果
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropWidth;
    tempCanvas.height = cropHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(croppedImage, 0, 0);

    // 更新主Canvas
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(tempCanvas, 0, 0);
  };

  $scope.rotateImage = function() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;

    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.translate(tempCanvas.width/2, tempCanvas.height/2);
    tempCtx.rotate(Math.PI/2);
    tempCtx.drawImage(canvas, -canvas.width/2, -canvas.height/2);

    // 更新主Canvas
    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.drawImage(tempCanvas, 0, 0);
  };

  $scope.saveEditedImage = function() {
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('file', blob, $scope.file.name);

      // 调用API保存文件
      FileService.updateFile($stateParams.fileId, formData).then(() => {
        $scope.cancelEdit();
        // 刷新页面显示新图片
        $state.reload();
      });
    }, $scope.file.mimetype);
  };

  $scope.cancelEdit = function() {
    $scope.isEditingImage = false;
    canvas.removeEventListener('mousedown', startCrop);
    canvas.removeEventListener('mousemove', updateCrop);
    canvas.removeEventListener('mouseup', endCrop);
  };

  // Load files
  Restangular.one('file/list').get({ id: $stateParams.id }).then(function (data) {
    $scope.files = data.files;
    setFile(data.files);

    // File not found, maybe it's a version
    if (!$scope.file) {
      Restangular.one('file/' + $stateParams.fileId + '/versions').get().then(function (data) {
        setFile(data.files);
      });
    }
  });

  /**
   * Return the next file.
   */
  $scope.nextFile = function () {
    var next = undefined;
    _.each($scope.files, function (value, key) {
      if (value.id === $stateParams.fileId) {
        next = $scope.files[key + 1];
      }
    });
    return next;
  };

  /**
   * Return the previous file.
   */
  $scope.previousFile = function () {
    var previous = undefined;
    _.each($scope.files, function (value, key) {
      if (value.id === $stateParams.fileId) {
        previous = $scope.files[key - 1];
      }
    });
    return previous;
  };

  /**
   * Navigate to the next file.
   */
  $scope.goNextFile = function () {
    var next = $scope.nextFile();
    if (next) {
      $state.go('^.file', { id: $stateParams.id, fileId: next.id });
    }
  };

  /**
   * Navigate to the previous file.
   */
  $scope.goPreviousFile = function () {
    var previous = $scope.previousFile();
    if (previous) {
      $state.go('^.file', { id: $stateParams.id, fileId: previous.id });
    }
  };

  /**
   * Open the file in a new window.
   */
  $scope.openFile = function () {
    window.open('../api/file/' + $stateParams.fileId + '/data');
  };

  /**
   * Open the file content a new window.
   */
  $scope.openFileContent = function () {
    window.open('../api/file/' + $stateParams.fileId + '/data?size=content');
  };

  /**
   * Print the file.
   */
  $scope.printFile = function () {
    var popup = window.open('../api/file/' + $stateParams.fileId + '/data', '_blank');
    popup.onload = function () {
      popup.print();
      popup.close();
    }
  };

  /**
   * Close the file preview.
   */
  $scope.closeFile = function () {
    $uibModalInstance.dismiss();
  };

  // Close the modal when the user exits this state
  var off = $transitions.onStart({}, function(transition) {
    if (!$uibModalInstance.closed) {
      if (transition.to().name === $state.current.name) {
        $uibModalInstance.close();
      } else {
        $uibModalInstance.dismiss();
      }
    }
    off();
  });

  /**
   * Return true if we can display the preview image.
   */
  $scope.canDisplayPreview = function () {
    return $scope.file && $scope.file.mimetype !== 'application/pdf';
  };
});