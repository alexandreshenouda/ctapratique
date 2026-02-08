import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loadDocuments, loadDocumentsGrouped, loadDocumentsBySubCategory, loadCategories, getCategoryInfoList, DocumentData, DocumentOrGroup, DocumentGroup, DocumentItem, SubCategoryGroup, CategoryGroup, CategoryInfo } from '../utils/csvLoader';
import { isLocalFile, openLocalFile } from '../utils/localAssets';
import MedicalTheme from '../theme/colors';

// ============================================================
// SECTION INFORMATIONS — Modifiez ce tableau pour ajouter ou
// retirer des annonces affichées en haut de la page Documents.
// Laissez le tableau vide [] pour masquer la section.
// ============================================================
const ANNOUNCEMENTS: string[] = [
  "Bienvenue ! Les mises à jour sont régulières. Le NOUVEAU GUIDE ADF 2026 sera disponible dans les prochains jours sur le site de l'ADF (https://adf.asso.fr/publications/)"," --> Pour retrouver un fichier vous devez cliquez sur l'onglet TOUS avant de procéder à votre recherche <--",
  // Ajoutez d'autres lignes ici, par exemple :
  // 'Mise à jour des fiches pratiques prévue en mars 2026.',
];
// ============================================================

interface CategoryProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  count: number;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryProps> = ({ title, icon, color, count, isSelected, onPress }) => (
  <TouchableOpacity 
    style={[styles.categoryCard, isSelected && { backgroundColor: `${color}20`, borderColor: color }]} 
    onPress={onPress}
  >
    <View style={[styles.categoryIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={[styles.categoryTitle, isSelected && { color }]}>{title}</Text>
    <Text style={styles.categoryCount}>{count} docs</Text>
  </TouchableOpacity>
);

interface DocumentComponentProps {
  document: DocumentData;
  onPress: () => void;
}

const DocumentComponent: React.FC<DocumentComponentProps> = ({ document, onPress }) => {
  const getDocumentIcon = () => {
    switch (document.type.toLowerCase()) {
      case 'pdf': return 'document-text';
      case 'video': return 'videocam';
      case 'ppt': return 'easel';
      case 'web': return 'globe';
      default: return 'document';
    }
  };

  const getActionIcon = () => {
    return document.iconType === 'external' ? 'open-outline' : 'download-outline';
  };

  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity style={styles.documentItem} onPress={handlePress}>
      <View style={[styles.documentIcon, { backgroundColor: `${document.color}15` }]}>
        <Ionicons name={getDocumentIcon() as keyof typeof Ionicons.glyphMap} size={20} color={document.color} />
      </View>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{document.title}</Text>
        <Text style={styles.documentDescription}>{document.description}</Text>
        <View style={styles.documentMeta}>
          <Text style={styles.documentType}>{document.type}</Text>
          {document.year && <Text style={styles.documentYear}>{document.year}</Text>}
        </View>
      </View>
      <Ionicons name={getActionIcon() as keyof typeof Ionicons.glyphMap} size={20} color="#666" />
    </TouchableOpacity>
  );
};

interface DocumentOrGroupItemProps {
  item: DocumentOrGroup;
  onPress: () => void;
}

const DocumentOrGroupItem: React.FC<DocumentOrGroupItemProps> = ({ item, onPress }) => {
  const isCategory = 'isCategory' in item && item.isCategory;
  const isSubCategory = 'isSubCategory' in item && item.isSubCategory;
  const isSearchHeader = 'id' in item && typeof item.id === 'string' && item.id.startsWith('search-header-');
  
  const getIcon = () => {
    if (isCategory) {
      return 'folder';
    }
    if (isSubCategory && !isSearchHeader) {
      return 'folder-open';
    }
    if (isSearchHeader) {
      return 'albums-outline';
    }
    if ('isGroup' in item && item.isGroup) {
      return 'folder';
    }
    const type = 'type' in item ? item.type : '';
    switch (type.toLowerCase()) {
      case 'pdf': return 'document-text';
      case 'video': return 'videocam';
      case 'ppt': return 'easel';
      case 'web': return 'globe';
      default: return 'document';
    }
  };

  const getActionIcon = () => {
    if (isSearchHeader) {
      return null; // No action icon for search headers
    }
    if (isCategory || isSubCategory) {
      return 'chevron-forward';
    }
    if ('isGroup' in item && item.isGroup) {
      return 'chevron-forward';
    }
    return 'iconType' in item && item.iconType === 'external' ? 'open-outline' : 'download-outline';
  };

  const getDisplayType = () => {
    if (isCategory) {
      const cat = item as CategoryGroup;
      return `${cat.count} document${cat.count > 1 ? 's' : ''}`;
    }
    if (isSubCategory) {
      const subCat = item as SubCategoryGroup;
      return `${subCat.count} document${subCat.count > 1 ? 's' : ''}`;
    }
    if ('isGroup' in item && item.isGroup) {
      return `${item.documents.length} documents`;
    }
    return 'type' in item ? item.type : '';
  };

  const getTitle = () => {
    if (isCategory) {
      return (item as CategoryGroup).category;
    }
    if (isSubCategory) {
      return (item as SubCategoryGroup).subCategory;
    }
    return 'title' in item ? item.title : '';
  };

  const getDescription = () => {
    if (isCategory) {
      const cat = item as CategoryGroup;
      return `${cat.count} document${cat.count > 1 ? 's' : ''} disponible${cat.count > 1 ? 's' : ''}`;
    }
    if (isSubCategory) {
      const subCat = item as SubCategoryGroup;
      return `${subCat.count} document${subCat.count > 1 ? 's' : ''} disponible${subCat.count > 1 ? 's' : ''}`;
    }
    return 'description' in item ? item.description : '';
  };

  // Render search headers differently (non-clickable, different style)
  if (isSearchHeader) {
    return (
      <View style={styles.searchHeaderItem}>
        <View style={[styles.documentIcon, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={getIcon() as keyof typeof Ionicons.glyphMap} size={20} color={item.color} />
        </View>
        <View style={styles.documentContent}>
          <Text style={styles.searchHeaderTitle}>{getTitle()}</Text>
          <Text style={styles.documentDescription}>{getDescription()}</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.documentItem} onPress={onPress}>
      <View style={[styles.documentIcon, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={getIcon() as keyof typeof Ionicons.glyphMap} size={20} color={item.color} />
      </View>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{getTitle()}</Text>
        <Text style={styles.documentDescription}>{getDescription()}</Text>
        <View style={styles.documentMeta}>
          <Text style={styles.documentType}>{getDisplayType()}</Text>
          {!isCategory && !isSubCategory && !('isGroup' in item && item.isGroup) && 'year' in item && (item as DocumentItem).year && (
            <Text style={styles.documentYear}>{(item as DocumentItem).year}</Text>
          )}
        </View>
      </View>
      {getActionIcon() && <Ionicons name={getActionIcon() as keyof typeof Ionicons.glyphMap} size={20} color="#666" />}
    </TouchableOpacity>
  );
};

const DocumentsScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedCategoryForSubCat, setSelectedCategoryForSubCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [documentsGrouped, setDocumentsGrouped] = useState<DocumentOrGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<DocumentGroup | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryGroup | null>(null);
  const [isGroupTransitioning, setIsGroupTransitioning] = useState(false);

  useEffect(() => {
    // Load documents from generated data file
    try {
      const loadedDocuments = loadDocuments();
      const loadedGrouped = loadDocumentsGrouped();
      setDocuments(loadedDocuments);
      setDocumentsGrouped(loadedGrouped);
    } catch (error) {
      console.error('Failed to load documents:', error);
      // Documents will remain empty array, could show error message
    }
  }, []);

  // Dynamically generate categories from documents
  const categories = useMemo(() => {
    return getCategoryInfoList();
  }, [documents]);

  const handleCategoryPress = (category: CategoryGroup) => {
    setIsGroupTransitioning(true);
    setSelectedCategoryForSubCat(category.category);
    setIsGroupTransitioning(false);
  };

  const handleGroupPress = (group: DocumentGroup) => {
    setIsGroupTransitioning(true);
    setSelectedGroup(null);
    
    // Attendre que le composant se mette à jour avant d'afficher le nouveau groupe
    setTimeout(() => {
      setSelectedGroup(group);
      setIsGroupTransitioning(false);
    }, 50);
  };

  const handleSubCategoryPress = (subCategory: SubCategoryGroup) => {
    setIsGroupTransitioning(true);
    setSelectedSubCategory(null);
    
    // Attendre que le composant se mette à jour avant d'afficher la nouvelle sous-catégorie
    setTimeout(() => {
      setSelectedSubCategory(subCategory);
      setIsGroupTransitioning(false);
    }, 50);
  };

  const handleBackFromGroup = () => {
    setSelectedGroup(null);
  };

  const handleBackFromSubCategory = () => {
    setSelectedSubCategory(null);
  };

  const handleBackFromCategoryView = () => {
    setSelectedCategoryForSubCat(null);
  };

  const handleDocumentOrGroupPress = (item: DocumentOrGroup) => {
    // Don't handle clicks on search result headers
    if ('id' in item && typeof item.id === 'string' && item.id.startsWith('search-header-')) {
      return;
    }
    
    if ('isCategory' in item && item.isCategory) {
      handleCategoryPress(item as CategoryGroup);
    } else if ('isSubCategory' in item && item.isSubCategory) {
      handleSubCategoryPress(item as SubCategoryGroup);
    } else if ('isGroup' in item && item.isGroup) {
      handleGroupPress(item as DocumentGroup);
    } else {
      handleDocumentPress(item as DocumentData);
    }
  };

  const getDocumentsByCategory = () => {
    let filtered = selectedCategory === 'Tous' ? documents : documents.filter(doc => doc.category === selectedCategory);
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getGroupedDocumentsByCategory = () => {
    // If we're on "Tous" and no specific category selected, show all categories
    if (selectedCategory === 'Tous' && !selectedCategoryForSubCat) {
      let filtered = loadCategories();
      
      if (searchQuery) {
        // When searching, show matching documents directly grouped by category
        const result: DocumentOrGroup[] = [];
        const categories = loadCategories();
        
        categories.forEach(cat => {
          // Find all documents in this category that match the search
          const matchingDocs = documents.filter(doc => 
            doc.category === cat.category &&
            (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          
          if (matchingDocs.length > 0) {
            // Add category header (non-clickable visual separator)
            result.push({
              id: `search-header-${cat.category}`,
              subCategory: cat.category,
              category: cat.category,
              documents: matchingDocs,
              isSubCategory: true,
              color: cat.color,
              count: matchingDocs.length
            } as SubCategoryGroup);
            
            // Add each matching document
            matchingDocs.forEach(doc => {
              result.push({
                ...doc,
                isGroup: false
              } as DocumentItem);
            });
          }
        });
        
        return result;
      }
      
      return filtered;
    }
    
    // If a specific category is selected from the main list, show its sub-categories
    const categoryToShow = selectedCategoryForSubCat || selectedCategory;
    let filtered = loadDocumentsBySubCategory(categoryToShow);
    
    if (searchQuery) {
      filtered = filtered.filter(item => {
        if ('isSubCategory' in item && item.isSubCategory) {
          const subCat = item as SubCategoryGroup;
          return subCat.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 subCat.documents.some(doc =>
                   doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   doc.description.toLowerCase().includes(searchQuery.toLowerCase())
                 );
        } else if ('isGroup' in item && item.isGroup) {
          return item.documents.some(doc =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else if ('title' in item) {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 ('description' in item && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return false;
      });
    }
    
    return filtered;
  };


  const handleDocumentPress = async (document: DocumentData) => {
    const targetUrl = document.url || 'https://play.senzu.app/s/53182@3b5e6adfe66aea771c693ea21860551b';
    
    // Vérifier si c'est un fichier local
    if (isLocalFile(targetUrl)) {
      try {
        await openLocalFile(targetUrl);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible d\'ouvrir le fichier local');
        console.error('Erreur ouverture fichier local:', error);
      }
      return;
    }
    
    // Fichier distant (logique existante)
    const actionText = document.iconType === 'external' ? 'Accéder au lien' : 'Télécharger';
    const descriptionText = document.iconType === 'external' 
      ? 'Ce document est disponible via un lien externe.'
      : 'Ce document est disponible en téléchargement sur le portail C ta Pratique.';
    
    // Sur web, Alert ne fonctionne pas bien, on ouvre directement
    if (Platform.OS === 'web') {
      // Ouvrir le lien
      if (typeof window !== 'undefined' && window.open) {
        window.open(targetUrl, '_blank');
      }
      return;
    }
    
    // Sur mobile, on utilise Alert
    Alert.alert(
      document.title,
      `${document.description}\n\nType: ${document.type}${document.year ? `\nAnnée: ${document.year}` : ''}\n\n${descriptionText}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: actionText, 
          onPress: async () => {
            try {
              await Linking.openURL(targetUrl);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'ouvrir le lien');
            }
          }
        }
      ]
    );
  };

  const filteredDocuments = getDocumentsByCategory();
  const filteredGroupedDocuments = getGroupedDocumentsByCategory();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.jpg')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        {selectedSubCategory ? (
          <View style={styles.groupHeader}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackFromSubCategory}>
              <Ionicons name="arrow-back" size={24} color={MedicalTheme.textOnPrimary} />
            </TouchableOpacity>
            <View style={styles.groupHeaderText}>
              <Text style={styles.headerTitle}>{selectedSubCategory.subCategory}</Text>
              <Text style={styles.headerSubtitle}>{selectedSubCategory.count} document{selectedSubCategory.count > 1 ? 's' : ''}</Text>
            </View>
          </View>
        ) : selectedGroup ? (
          <View style={styles.groupHeader}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackFromGroup}>
              <Ionicons name="arrow-back" size={24} color={MedicalTheme.textOnPrimary} />
            </TouchableOpacity>
            <View style={styles.groupHeaderText}>
              <Text style={styles.headerTitle}>{selectedGroup.title}</Text>
              <Text style={styles.headerSubtitle}>{selectedGroup.documents.length} documents</Text>
            </View>
          </View>
        ) : selectedCategoryForSubCat ? (
          <View style={styles.groupHeader}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackFromCategoryView}>
              <Ionicons name="arrow-back" size={24} color={MedicalTheme.textOnPrimary} />
            </TouchableOpacity>
            <View style={styles.groupHeaderText}>
              <Text style={styles.headerTitle}>{selectedCategoryForSubCat}</Text>
              <Text style={styles.headerSubtitle}>Sous-catégories</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>Référentiels, Guides et Fiches pratiques</Text>
            <Text style={styles.headerSubtitle}>Hygiène, Stérilisation et Asepsie Dentaire</Text>
          </>
        )}
      </View>

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <View style={styles.announcementsContainer}>
          {ANNOUNCEMENTS.map((text, index) => (
            <View key={index} style={styles.announcementRow}>
              <Ionicons name="information-circle" size={18} color={MedicalTheme.primary} style={styles.announcementIcon} />
              <Text style={styles.announcementText}>{text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          {Platform.OS === 'web' ? (
            <View style={styles.categoriesWebContainer}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.key}
                  title={category.title}
                  icon={category.icon as keyof typeof Ionicons.glyphMap}
                  color={category.color}
                  count={category.count}
                  isSelected={selectedCategory === category.key}
                  onPress={() => {
                    setSelectedCategory(category.key);
                    setSelectedCategoryForSubCat(null);
                    setSelectedSubCategory(null);
                    setSelectedGroup(null);
                  }}
                />
              ))}
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.categoriesContainer}
              style={styles.categoriesScroll}
            >
              {categories.map((category) => (
                <CategoryCard
                  key={category.key}
                  title={category.title}
                  icon={category.icon as keyof typeof Ionicons.glyphMap}
                  color={category.color}
                  count={category.count}
                  isSelected={selectedCategory === category.key}
                  onPress={() => {
                    setSelectedCategory(category.key);
                    setSelectedCategoryForSubCat(null);
                    setSelectedSubCategory(null);
                    setSelectedGroup(null);
                  }}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Documents List */}
        <View style={styles.documentsSection}>
          {isGroupTransitioning ? (
            <View style={styles.loadingState}>
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : selectedSubCategory ? (
            /* Sub-Category Detail View */
            <>
              <View style={styles.documentsHeader}>
                <Text style={styles.sectionTitle}>Documents - {selectedSubCategory.subCategory}</Text>
                <Text style={styles.documentsCount}>
                  {selectedSubCategory.count} document{selectedSubCategory.count > 1 ? 's' : ''}
                </Text>
              </View>

              {(() => {
                // Group documents by ID within sub-category
                const groupedMap = new Map<string, DocumentData[]>();
                selectedSubCategory.documents.forEach(doc => {
                  if (!groupedMap.has(doc.id)) {
                    groupedMap.set(doc.id, []);
                  }
                  groupedMap.get(doc.id)!.push(doc);
                });

                const items: (DocumentData | DocumentGroup)[] = [];
                groupedMap.forEach((docs, id) => {
                  if (docs.length === 1) {
                    items.push(docs[0]);
                  } else {
                    const firstDoc = docs[0];
                    items.push({
                      id,
                      documents: docs,
                      isGroup: true,
                      title: firstDoc.title,
                      category: firstDoc.category,
                      subCategory: firstDoc.subCategory,
                      type: `${docs.length} documents`,
                      description: `${docs.length} documents disponibles`,
                      iconType: firstDoc.iconType,
                      color: firstDoc.color
                    } as DocumentGroup);
                  }
                });

                return items.map((item, index) => {
                  if ('isGroup' in item && item.isGroup) {
                    const group = item as DocumentGroup;
                    return (
                      <DocumentOrGroupItem
                        key={`subcat-${selectedSubCategory.id}-group-${index}-${group.id}`}
                        item={group}
                        onPress={() => handleGroupPress(group)}
                      />
                    );
                  } else {
                    const doc = item as DocumentData;
                    return (
                      <DocumentComponent
                        key={`subcat-${selectedSubCategory.id}-doc-${index}-${doc.title}-${doc.year || 'no-year'}`}
                        document={doc}
                        onPress={() => handleDocumentPress(doc)}
                      />
                    );
                  }
                });
              })()}
            </>
          ) : selectedGroup ? (
            /* Group Detail View */
            <>
              <View style={styles.documentsHeader}>
                <Text style={styles.sectionTitle}>Documents dans ce groupe</Text>
                <Text style={styles.documentsCount}>
                  {selectedGroup.documents.length} document{selectedGroup.documents.length > 1 ? 's' : ''}
                </Text>
              </View>

              {selectedGroup.documents.map((document, index) => (
                <DocumentComponent
                  key={`group-${selectedGroup.id}-doc-${index}-${document.title}-${document.year || 'no-year'}`}
                  document={document}
                  onPress={() => handleDocumentPress(document)}
                />
              ))}
            </>
          ) : (
            /* Main Documents View */
            <>
              <View style={styles.documentsHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'Tous' && !selectedCategoryForSubCat 
                    ? 'Toutes les catégories' 
                    : (selectedCategoryForSubCat || selectedCategory !== 'Tous')
                      ? `${selectedCategoryForSubCat || selectedCategory}`
                      : selectedCategory}
                </Text>
                <Text style={styles.documentsCount}>
                  {filteredGroupedDocuments.length} élément{filteredGroupedDocuments.length > 1 ? 's' : ''}
                </Text>
              </View>

              {filteredGroupedDocuments.length > 0 ? (
                filteredGroupedDocuments.map((item, index) => {
                  const keyPrefix = 'isCategory' in item && item.isCategory 
                    ? 'category'
                    : ('isSubCategory' in item && item.isSubCategory 
                      ? 'subcat' 
                      : ('isGroup' in item && item.isGroup ? 'group' : 'item'));
                  const keyTitle = 'category' in item && 'isCategory' in item && item.isCategory
                    ? item.category
                    : ('title' in item ? item.title : ('subCategory' in item ? item.subCategory : 'unknown'));
                  return (
                    <DocumentOrGroupItem
                      key={`main-${item.id}-${keyPrefix}-${index}-${keyTitle}`}
                      item={item}
                      onPress={() => handleDocumentOrGroupPress(item)}
                    />
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="document-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyStateText}>Aucun document trouvé</Text>
                  <Text style={styles.emptyStateSubtext}>
                    {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Sélectionnez une autre catégorie'}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalTheme.background,
  },
  logoContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    backgroundColor: MedicalTheme.primary,
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 4,
  },
  announcementsContainer: {
    backgroundColor: '#EAF4FE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cce0f5',
  },
  announcementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
  announcementIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  announcementText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    flex: 1,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingRight: 30, // Extra padding for last item
  },
  categoriesWebContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 12,
    ...Platform.select({
      web: {
        maxHeight: 200,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: 'MedicalTheme.primary #f0f0f0',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f0f0f0',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'MedicalTheme.primary',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#0056b3',
        },
      },
    }),
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      web: {
        width: 100,
        marginRight: 0,
        marginBottom: 12,
        flexGrow: 0,
        flexShrink: 0,
      },
    }),
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  documentsSection: {
    padding: 15,
  },
  documentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  documentsCount: {
    fontSize: 14,
    color: '#666',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
    }),
  },
  searchHeaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: MedicalTheme.primary,
  },
  searchHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MedicalTheme.primary,
    marginBottom: 4,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 6,
  },
  documentMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  documentType: {
    fontSize: 12,
    color: 'MedicalTheme.primary',
    fontWeight: '500',
  },
  documentYear: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: `${MedicalTheme.textOnPrimary}20`,
  },
  groupHeaderText: {
    flex: 1,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: MedicalTheme.textSecondary,
    fontStyle: 'italic',
  },
});

export default DocumentsScreen;
