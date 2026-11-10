import AtmosphericScene from '../components/AtmosphericScene';
import { art } from './data';
export default function CenizaScene({image,active,reduced}: {image:string;active:boolean;reduced:boolean}) {
  return <AtmosphericScene image={image} neon actor={image.includes('/archivo/') ? undefined : art['lamp']} active={active} reduced={reduced} />;
}
