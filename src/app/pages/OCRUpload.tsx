// import { useState } from 'react';
// import { Card } from '../components/ui/card';
// import { Button } from '../components/ui/button';
// import { Input } from '../components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// import { Badge } from '../components/ui/badge';
// import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Eye } from 'lucide-react';
// import { municipalities } from '../data/municipalityData';
// import type { OCRDocument, ZoneRegulation } from '../types/zoning-platform';

// export function OCRUpload() {
//   const [documents, setDocuments] = useState<OCRDocument[]>([
//     {
//       id: '1',
//       fileName: 'Toronto_Zoning_Bylaw_569-2013.pdf',
//       municipalityId: 'toronto',
//       uploadDate: '2024-02-15T10:30:00',
//       status: 'completed',
//       pageCount: 156,
//       extractedData: [
//         {
//           id: 'ocr-1',
//           municipalityId: 'toronto',
//           zoneName: 'Residential Detached',
//           zoneCode: 'RD',
//           permittedUses: ['Single detached dwelling', 'Home occupation'],
//           maxDensity: 30,
//           maxHeight: 10,
//           minLotSize: 450,
//           minParkingPerUnit: 1,
//         },
//       ]
//     },
//     {
//       id: '2',
//       fileName: 'Vancouver_Zoning_Schedule.pdf',
//       municipalityId: 'vancouver',
//       uploadDate: '2024-02-18T14:20:00',
//       status: 'processing',
//       pageCount: 89,
//     },
//     {
//       id: '3',
//       fileName: 'Ottawa_Zoning_Amendment_2024.pdf',
//       municipalityId: 'ottawa',
//       uploadDate: '2024-02-20T09:15:00',
//       status: 'failed',
//       pageCount: 24,
//     },
//   ]);

//   const [isUploading, setIsUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedMunicipality, setSelectedMunicipality] = useState('');
//   const [selectedDoc, setSelectedDoc] = useState<OCRDocument | null>(null);

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile || !selectedMunicipality) return;

//     setIsUploading(true);

//     // Simulate OCR processing
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     const newDoc: OCRDocument = {
//       id: String(Date.now()),
//       fileName: selectedFile.name,
//       municipalityId: selectedMunicipality,
//       uploadDate: new Date().toISOString(),
//       status: 'processing',
//       pageCount: Math.floor(Math.random() * 200) + 20,
//     };

//     setDocuments([newDoc, ...documents]);
//     setSelectedFile(null);
//     setIsUploading(false);

//     // Simulate processing completion
//     setTimeout(() => {
//       setDocuments(docs => docs.map(doc => 
//         doc.id === newDoc.id 
//           ? { 
//               ...doc, 
//               status: 'completed',
//               extractedData: generateMockExtractedData(selectedMunicipality)
//             }
//           : doc
//       ));
//     }, 5000);
//   };

//   const generateMockExtractedData = (muniId: string): Partial<ZoneRegulation>[] => {
//     const mockData: Partial<ZoneRegulation>[] = [
//       {
//         zoneName: 'Residential Low Density',
//         zoneCode: 'R1',
//         permittedUses: ['Single detached dwelling'],
//         maxDensity: 25,
//         maxHeight: 10.5,
//         minParkingPerUnit: 2,
//       },
//       {
//         zoneName: 'Commercial',
//         zoneCode: 'C1',
//         permittedUses: ['Retail', 'Office', 'Restaurant'],
//         maxHeight: 15,
//         minParkingPerUnit: 3,
//       },
//     ];
//     return mockData;
//   };

//   const getStatusBadge = (status: OCRDocument['status']) => {
//     switch (status) {
//       case 'completed':
//         return <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
//           <CheckCircle className="w-3 h-3 mr-1" /> Completed
//         </Badge>;
//       case 'processing':
//         return <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
//           <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
//         </Badge>;
//       case 'failed':
//         return <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline">
//           <AlertCircle className="w-3 h-3 mr-1" /> Failed
//         </Badge>;
//     }
//   };

//   const getMunicipalityName = (id: string) => {
//     return municipalities.find(m => m.id === id)?.name || id;
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-slate-900 mb-1">OCR Document Upload</h2>
//         <p className="text-slate-600">
//           Upload zoning by-law PDFs for automated data extraction using OCR technology
//         </p>
//       </div>

//       {/* Upload Form */}
//       <Card className="p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <Upload className="w-5 h-5 text-slate-600" />
//           <h3 className="text-slate-900">Upload New Document</h3>
//         </div>

//         <div className="space-y-4">
//           <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
//             <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
//             <p className="text-slate-700 mb-2">
//               {selectedFile ? selectedFile.name : 'Click to select a PDF file'}
//             </p>
//             <p className="text-sm text-slate-500 mb-4">
//               Supported formats: PDF (Max 50MB)
//             </p>
//             <Input
//               type="file"
//               accept=".pdf"
//               onChange={handleFileSelect}
//               className="max-w-xs mx-auto"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-2 text-sm font-medium text-slate-700">
//                 Municipality
//               </label>
//               <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select municipality" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {municipalities.map(muni => (
//                     <SelectItem key={muni.id} value={muni.id}>{muni.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-end">
//               <Button
//                 onClick={handleUpload}
//                 disabled={!selectedFile || !selectedMunicipality || isUploading}
//                 className="w-full"
//               >
//                 {isUploading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-4 h-4 mr-2" />
//                     Upload & Process
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h4 className="font-medium text-blue-900 mb-2">How OCR Processing Works</h4>
//             <ul className="text-sm text-blue-800 space-y-1">
//               <li>• Document is uploaded and converted to images</li>
//               <li>• OCR technology extracts text from each page</li>
//               <li>• Machine learning identifies zoning data patterns</li>
//               <li>• Extracted data is standardized and validated</li>
//               <li>• Results are added to the database for querying</li>
//             </ul>
//           </div>
//         </div>
//       </Card>

//       {/* Document History */}
//       <Card className="p-6">
//         <h3 className="text-slate-900 mb-4">Processing History</h3>
//         <div className="space-y-4">
//           {documents.map(doc => (
//             <div
//               key={doc.id}
//               className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <FileText className="w-5 h-5 text-slate-600" />
//                     <h4 className="font-medium text-slate-900">{doc.fileName}</h4>
//                     {getStatusBadge(doc.status)}
//                   </div>
//                   <div className="flex gap-4 text-sm text-slate-600">
//                     <span>{getMunicipalityName(doc.municipalityId)}</span>
//                     <span>•</span>
//                     <span>{doc.pageCount} pages</span>
//                     <span>•</span>
//                     <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
//                   </div>
//                 </div>

//                 {doc.status === 'completed' && doc.extractedData && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
//                   >
//                     <Eye className="w-4 h-4 mr-2" />
//                     {selectedDoc?.id === doc.id ? 'Hide' : 'View'} Data
//                   </Button>
//                 )}
//               </div>

//               {doc.status === 'processing' && (
//                 <div className="mt-3">
//                   <div className="w-full bg-slate-200 rounded-full h-2">
//                     <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
//                   </div>
//                   <p className="text-xs text-slate-500 mt-2">Processing document... This may take several minutes.</p>
//                 </div>
//               )}

//               {doc.status === 'failed' && (
//                 <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
//                   <p className="text-sm text-red-800">
//                     <strong>Error:</strong> Failed to process document. The file may be corrupted or in an unsupported format.
//                   </p>
//                 </div>
//               )}

//               {selectedDoc?.id === doc.id && doc.extractedData && (
//                 <div className="mt-4 pt-4 border-t border-slate-200">
//                   <h4 className="font-medium text-slate-900 mb-3">Extracted Regulations</h4>
//                   <div className="space-y-3">
//                     {doc.extractedData.map((zone, idx) => (
//                       <div key={idx} className="bg-slate-50 rounded-lg p-4">
//                         <div className="flex items-center gap-3 mb-2">
//                           <Badge variant="outline">{zone.zoneCode}</Badge>
//                           <span className="font-medium text-slate-900">{zone.zoneName}</span>
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
//                           {zone.maxDensity && (
//                             <div>
//                               <p className="text-slate-500">Max Density</p>
//                               <p className="font-medium">{zone.maxDensity} u/ha</p>
//                             </div>
//                           )}
//                           {zone.maxHeight && (
//                             <div>
//                               <p className="text-slate-500">Max Height</p>
//                               <p className="font-medium">{zone.maxHeight}m</p>
//                             </div>
//                           )}
//                           {zone.minParkingPerUnit && (
//                             <div>
//                               <p className="text-slate-500">Parking</p>
//                               <p className="font-medium">{zone.minParkingPerUnit}/unit</p>
//                             </div>
//                           )}
//                           {zone.minLotSize && (
//                             <div>
//                               <p className="text-slate-500">Min Lot</p>
//                               <p className="font-medium">{zone.minLotSize}m²</p>
//                             </div>
//                           )}
//                         </div>
//                         {zone.permittedUses && (
//                           <div className="mt-3">
//                             <p className="text-xs text-slate-500 mb-2">Permitted Uses</p>
//                             <div className="flex flex-wrap gap-2">
//                               {zone.permittedUses.map((use, i) => (
//                                 <Badge key={i} variant="secondary" className="text-xs">
//                                   {use}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </Card>

//       {/* Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="p-6 text-center">
//           <p className="text-sm text-slate-600 mb-1">Total Documents</p>
//           <p className="text-3xl font-semibold text-slate-900">{documents.length}</p>
//         </Card>
//         <Card className="p-6 text-center">
//           <p className="text-sm text-slate-600 mb-1">Completed</p>
//           <p className="text-3xl font-semibold text-green-900">
//             {documents.filter(d => d.status === 'completed').length}
//           </p>
//         </Card>
//         <Card className="p-6 text-center">
//           <p className="text-sm text-slate-600 mb-1">Processing</p>
//           <p className="text-3xl font-semibold text-blue-900">
//             {documents.filter(d => d.status === 'processing').length}
//           </p>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Eye } from 'lucide-react';
import { municipalities } from '../data/waterlooGuelphData';
import type { OCRDocument, ZoneRegulation } from '../types/zoning-platform';

export function OCRUpload() {
  const [documents, setDocuments] = useState<OCRDocument[]>([
    {
      id: '1',
      fileName: 'Waterloo_Zoning_Bylaw_2018-001.pdf',
      municipalityId: 'waterloo',
      uploadDate: '2024-02-15T10:30:00',
      status: 'completed',
      pageCount: 245,
      extractedData: [
        {
          id: 'ocr-1',
          municipalityId: 'waterloo',
          zoneName: 'Low Density Residential',
          zoneCode: 'R1',
          permittedUses: ['Single detached dwelling', 'Home occupation'],
          maxDensity: 25,
          maxHeight: 10,
          minLotSize: 450,
          minParkingPerUnit: 2,
        },
      ]
    },
    {
      id: '2',
      fileName: 'Guelph_Zoning_Schedule_R1-R2.pdf',
      municipalityId: 'guelph',
      uploadDate: '2024-02-18T14:20:00',
      status: 'processing',
      pageCount: 89,
    },
    {
      id: '3',
      fileName: 'Waterloo_Amendment_2023-045.pdf',
      municipalityId: 'waterloo',
      uploadDate: '2024-02-20T09:15:00',
      status: 'failed',
      pageCount: 24,
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<OCRDocument | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedMunicipality) return;

    setIsUploading(true);

    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newDoc: OCRDocument = {
      id: String(Date.now()),
      fileName: selectedFile.name,
      municipalityId: selectedMunicipality,
      uploadDate: new Date().toISOString(),
      status: 'processing',
      pageCount: Math.floor(Math.random() * 200) + 20,
    };

    setDocuments([newDoc, ...documents]);
    setSelectedFile(null);
    setIsUploading(false);

    // Simulate processing completion
    setTimeout(() => {
      setDocuments(docs => docs.map(doc => 
        doc.id === newDoc.id 
          ? { 
              ...doc, 
              status: 'completed',
              extractedData: generateMockExtractedData(selectedMunicipality)
            }
          : doc
      ));
    }, 5000);
  };

  const generateMockExtractedData = (muniId: string): Partial<ZoneRegulation>[] => {
    const mockData: Partial<ZoneRegulation>[] = [
      {
        zoneName: muniId === 'waterloo' ? 'Low Density Residential' : 'Residential Single Detached',
        zoneCode: muniId === 'waterloo' ? 'R1' : 'R.1',
        permittedUses: ['Single detached dwelling', 'Accessory dwelling unit'],
        maxDensity: muniId === 'waterloo' ? 25 : 30,
        maxHeight: muniId === 'waterloo' ? 10 : 10.5,
        minParkingPerUnit: muniId === 'waterloo' ? 2 : 1.5,
      },
      {
        zoneName: muniId === 'waterloo' ? 'Medium Density Residential' : 'Residential Duplex/Triplex',
        zoneCode: muniId === 'waterloo' ? 'R2' : 'R.2',
        permittedUses: ['Semi-detached', 'Duplex', 'Triplex'],
        maxDensity: muniId === 'waterloo' ? 50 : 60,
        maxHeight: 11,
        minParkingPerUnit: muniId === 'waterloo' ? 1.5 : 1.25,
      },
    ];
    return mockData;
  };

  const getStatusBadge = (status: OCRDocument['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
          <CheckCircle className="w-3 h-3 mr-1" /> Completed
        </Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
        </Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline">
          <AlertCircle className="w-3 h-3 mr-1" /> Failed
        </Badge>;
    }
  };

  const getMunicipalityName = (id: string) => {
    return municipalities.find(m => m.id === id)?.name || id;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-slate-900 mb-1">Zoning By-law File Upload</h2>
        <p className="text-slate-600">
          
        </p>
      </div>

      {/* Upload Form */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Upload New Document</h3>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 mb-2">
              {selectedFile ? selectedFile.name : 'Click to select a PDF file'}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Supported formats: PDF (Max 50MB)
            </p>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="max-w-xs mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">

            <div className="flex items-end">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedMunicipality || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Process
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Document is uploaded and converted to simplified data</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Document History */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Processing History</h3>
        <div className="space-y-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <h4 className="font-medium text-slate-900">{doc.fileName}</h4>
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span>{getMunicipalityName(doc.municipalityId)}</span>
                    <span>•</span>
                    <span>{doc.pageCount} pages</span>
                    <span>•</span>
                    <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {doc.status === 'completed' && doc.extractedData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedDoc?.id === doc.id ? 'Hide' : 'View'} Data
                  </Button>
                )}
              </div>

              {doc.status === 'processing' && (
                <div className="mt-3">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Processing document... Extracting zoning regulations.</p>
                </div>
              )}

              {doc.status === 'failed' && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> Failed to process document. The file may be corrupted or in an unsupported format.
                  </p>
                </div>
              )}

              {selectedDoc?.id === doc.id && doc.extractedData && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3">Extracted Regulations ({doc.extractedData.length} zones)</h4>
                  <div className="space-y-3">
                    {doc.extractedData.map((zone, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{zone.zoneCode}</Badge>
                          <span className="font-medium text-slate-900">{zone.zoneName}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {zone.maxDensity && (
                            <div>
                              <p className="text-slate-500">Max Density</p>
                              <p className="font-medium">{zone.maxDensity} u/ha</p>
                            </div>
                          )}
                          {zone.maxHeight && (
                            <div>
                              <p className="text-slate-500">Max Height</p>
                              <p className="font-medium">{zone.maxHeight}m</p>
                            </div>
                          )}
                          {zone.minParkingPerUnit && (
                            <div>
                              <p className="text-slate-500">Parking</p>
                              <p className="font-medium">{zone.minParkingPerUnit}/unit</p>
                            </div>
                          )}
                          {zone.minLotSize && (
                            <div>
                              <p className="text-slate-500">Min Lot</p>
                              <p className="font-medium">{zone.minLotSize}m²</p>
                            </div>
                          )}
                        </div>
                        {zone.permittedUses && (
                          <div className="mt-3">
                            <p className="text-xs text-slate-500 mb-2">Permitted Uses</p>
                            <div className="flex flex-wrap gap-2">
                              {zone.permittedUses.map((use, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {use}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
       
      </Card>
    </div>
  );
}