interface DocumentData {
  id: string;
  title: string;
  category: string;
  type: string;
  year?: string;
  description: string;
  url?: string;
  iconType: 'external' | 'download';
  color: string;
}

// For now, we'll use a static import of the CSV data
// In a real app, you might want to fetch this from a server or use a CSV parsing library
const csvData = `id,title,category,type,year,description,url,iconType,color
1,URPS PACA,URPS,PDF,,Union Régionale des Professionnels de Santé PACA,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#FF6B6B
2,URPS NORM.,URPS,PDF,,Union Régionale des Professionnels de Santé Normandie,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#FF6B6B
3,COVID 2020,COVID,PDF,2020,Protocole sanitaire COVID-19 pour cabinets dentaires,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#FF9500
4,COVID 2021,COVID,PDF,2021,Mise à jour des protocoles COVID-19,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#FF9500
5,COVID-19,COVID,PDF,,Guide général COVID-19 pour professionnels de santé,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#FF9500
6,GUIDE DGS-2011,Guides,PDF,2011,Guide de prévention des infections - Direction Générale de la Santé,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#007AFF
7,Guide 2006,Guides,PDF,2006,Guide de prévention des infections liées aux soins,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#007AFF
8,AIR REPIAS,Guides,PDF,,Réseau de Prévention des Infections Associées aux Soins,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#007AFF
9,QUALIOPI,Certifications,PDF,,Certification qualité formation professionnelle,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#34C759
10,CERTIBIOCIDE,Certifications,PDF,,Certificat biocide pour produits désinfectants,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#34C759
11,ADF 2015,Congrès,PDF,2015,Association Dentaire Française - Congrès 2015,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#AF52DE
12,Ortho 2020,Congrès,PDF,2020,Congrès Orthodontie 2020,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#AF52DE
13,Ortho 2017,Congrès,PDF,2017,Congrès Orthodontie 2017,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#AF52DE
14,Stand 2017,Congrès,PDF,2017,Présentation stand formation 2017,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#AF52DE
15,ART. CDF MAG,Articles,PDF,,Article Chirurgiens-Dentistes de France Magazine,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#5856D6
16,Fiches ONCD,Fiches,PDF,,Ordre National des Chirurgiens-Dentistes - Fiches pratiques,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#00C7BE
17,PLAN STERIL,Fiches,PDF,,Plan de stérilisation type pour cabinet dentaire,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#00C7BE
18,Fiche Sté,Fiches,PDF,,Fiche société - Informations entreprise,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#00C7BE
19,Fiche Unit,Fiches,PDF,,Fiche unité de soins dentaires,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#00C7BE
20,Cahier Maint.,Fiches,PDF,,Cahier de maintenance des équipements,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#00C7BE
21,INVS 2009,Surveillance,PDF,2009,Institut de Veille Sanitaire - Rapport 2009,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#FF3B30
22,INJONC.ARS,Surveillance,PDF,,Injonctions Agence Régionale de Santé,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#FF3B30
23,F. ARS/PACA,Surveillance,PDF,,Formulaire ARS PACA,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#FF3B30
24,F. ARS/ARA,Surveillance,PDF,,Formulaire ARS Auvergne-Rhône-Alpes,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#FF3B30
25,Implan 2008,Spécialisations,PDF,2008,Protocole implantologie 2008,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#8E8E93
26,IMPLANTO,Spécialisations,PDF,,Guide implantologie moderne,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#8E8E93
27,DASRI,Déchets,PDF,,Déchets d'Activités de Soins à Risques Infectieux,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#32D74B
28,EVAL DASRI,Déchets,PDF,,Évaluation gestion DASRI,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#32D74B
29,ECO RESPONSABLE,Déchets,PDF,,Pratiques éco-responsables au cabinet dentaire,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#32D74B
30,DECHETS,Déchets,PDF,,Gestion des déchets de cabinet dentaire,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#32D74B
31,TEST EAU,Contrôles,PDF,,Tests qualité de l'eau au cabinet dentaire,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#007AFF
32,QUALITE EAU,Contrôles,PDF,,Contrôle qualité de l'eau - Protocoles,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#007AFF
33,RADIOPROTECT,Contrôles,PDF,,Radioprotection au cabinet dentaire,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#007AFF
34,DGCCRF,Réglementation,PDF,,Direction Générale de la Concurrence et de la Répression des Fraudes,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#FF2D92
35,ANSM,Réglementation,PDF,,Agence Nationale de Sécurité du Médicament,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#FF2D92
36,EPI CPIAS,Réglementation,PDF,,Équipements de Protection Individuelle - CPIAS,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#FF2D92
37,AES/CPIAS,Réglementation,PDF,,Accidents d'Exposition au Sang - CPIAS,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#FF2D92
38,BELG-CSS-1,International,PDF,,Conseil Supérieur de la Santé Belgique - Document 1,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#FFCC02
39,BELG-CSS-2,International,PDF,,Conseil Supérieur de la Santé Belgique - Document 2,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#FFCC02
40,VIDEOS,Médias,Video,,Collection de vidéos formation,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#BF5AF2
41,Vidéo URPS,Médias,Video,,Vidéos formation URPS,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#BF5AF2
42,PowerPoint,Médias,PPT,,Présentations PowerPoint formation,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,download,#BF5AF2
43,POURET MEDICAL,Partenaires,PDF,,Documentation partenaire Pouret Médical,https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b,external,#6AC4DC`;

function parseCSV(csvText: string): DocumentData[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const document: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (header === 'year' && !value) {
        // Skip empty year values
        return;
      }
      if (header === 'iconType') {
        document[header] = value as 'external' | 'download';
      } else {
        document[header] = value;
      }
    });
    
    return document as DocumentData;
  });
}

export function loadDocuments(): DocumentData[] {
  return parseCSV(csvData);
}

export type { DocumentData };
