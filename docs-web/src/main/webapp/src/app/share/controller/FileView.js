'use strict';

/**
 * File view controller.
 */
angular.module('share').controller('FileView', function($uibModal, $state, $stateParams, $timeout) {
  var modal = $uibModal.open({
    windowClass: 'modal modal-fileview',
    templateUrl: 'partial/share/file.view.html',
    controller: 'FileModalView',
    size: 'lg'
  });

  // Returns to share view on file close
  modal.closed = false;
  modal.result.then(function() {
    modal.closed = true;
  }, function() {
    modal.closed = true;
    $timeout(function () {
      // After all router transitions are passed,
      // if we are still on the file route, go back to the share
      if ($state.current.name === 'share.file') {
        $state.go('share', { documentId: $stateParams.documentId, shareId: $stateParams.shareId });
      }
    });
  });
  // 新增方法：检查是否是图片文件
  $scope.isImage = function() {
    return $scope.file && $scope.file.mimetype.startsWith('image/');
  };

  // 打开图片编辑器
  $scope.openImageEditor = function() {
    const editorModal = $uibModal.open({
      windowClass: 'modal modal-image-editor',
      templateUrl: 'partial/share/image.editor.html',
      controller: 'ImageEditorCtrl',
      size: 'xl',
      resolve: {
        file: () => $scope.file // 传递当前文件数据
      }
    });

    // 保存编辑后的图片
    editorModal.result.then(function(editedImage) {
      // 将Base64转换为Blob
      const blob = dataURItoBlob(editedImage);
      const formData = new FormData();
      formData.append('file', blob, $scope.file.name);

      // 上传到后端
      $http.put(`/api/file/${$stateParams.fileId}/data`, formData, {
        headers: { 'Content-Type': undefined }
      }).then(() => {
        // 刷新预览
        $scope.$broadcast('refreshPreview');
      });
    });
  };

  // Base64转Blob工具函数
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

});