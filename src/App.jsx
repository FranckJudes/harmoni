import { useEffect, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import domtoimage from 'dom-to-image';

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default function App() {
  const canvasRef = useRef(null);
  const modelerRef = useRef(null);

  useEffect(() => {
    modelerRef.current = new BpmnModeler({
      container: canvasRef.current
    });

    modelerRef.current.createDiagram();
    return () => {
      modelerRef.current.destroy();
    };
  }, []);

  const handleDownloadXML = async () => {
    try {
      const { xml } = await modelerRef.current.saveXML();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([xml], { type: 'application/xml' }));
      link.download = 'diagram.bpmn';
      link.click();
    } catch (err) {
      console.error('Erreur lors du téléchargement du XML:', err);
    }
  };

  const handleDownloadSVG = async () => {
    try {
      const { svg } = await modelerRef.current.saveSVG();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      link.download = 'diagram.svg';
      link.click();
    } catch (err) {
      console.error('Erreur lors du téléchargement du SVG:', err);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      const node = canvasRef.current;
      const dataURL = await domtoimage.toPng(node);
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'diagram.png';
      link.click();
    } catch (err) {
      console.error('Erreur lors du téléchargement du PNG:', err);
    }
  };

  return (
    <div>
      <div ref={canvasRef}
           style={{
             width: '100vw',
             height: '70vh',
             overflow: 'hidden',
             border: '1px solid #121314'
           }}
      />
      <button onClick={handleDownloadXML}>Télécharger en XML</button>
      <button onClick={handleDownloadSVG}>Télécharger en SVG</button>
      <button onClick={handleDownloadPNG}>Télécharger en PNG</button>
    </div>
  );
}