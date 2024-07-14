import React, { useRef, useState, useCallback } from 'react';
import 'antd/dist/antd.min.css';
import Webcam from 'react-webcam';
import './index.css';
import { Button } from 'antd';
import { CameraOutlined, UndoOutlined } from '@ant-design/icons';

const Camera = (props) => {
  const webcamRef = useRef(null);
  const imaageRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const handleDownload = () => {
    setImgSrc(null);
    const img = imaageRef.current;
    const url = img.src;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'image.png';
    anchor.click();
  };

  return (
    <div className='container'>
      {imgSrc ? (
        <img ref={imaageRef} src={imgSrc} alt='webcam' />
      ) : (
        <Webcam
          height={600}
          width={600}
          ref={webcamRef}
          screenshotFormat='image/png'
          screenshotQuality={0.8}
          imageSmoothing
        />
      )}
      <div className='btn-container'>
        {imgSrc ? (
          <Button key='retake' type='primary' icon={<UndoOutlined />} onClick={retake}>
            Retake photo
          </Button>
        ) : (
          <Button key='capture' type='primary' icon={<CameraOutlined />} onClick={capture}>
            Capture photo
          </Button>
        )}
        {imgSrc ? (
          <Button key='save' type='primary' onClick={handleDownload}>
            Download Photo
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Camera;
