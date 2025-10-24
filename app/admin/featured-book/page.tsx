'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/image-upload';

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string | null;
  genre: string | null;
  description: string | null;
  pageCount: number | null;
  averageRating?: number;
  _count?: {
    reviews: number;
    readingLists: number;
  };
}

interface FeaturedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  description: string;
  rating: number | null;
  reviewCount: number;
  readers: number;
  quote: string | null;
  pages: number | null;
  genre: string;
  badge: string | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  book: Book;
}

export default function FeaturedBookAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingFeatured, setEditingFeatured] = useState<FeaturedBook | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: '',
    category: '',
    description: '',
    rating: 0,
    reviewCount: 0,
    readers: 0,
    quote: '',
    pages: 0,
    genre: '',
    badge: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchBooks();
    fetchFeaturedBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchFeaturedBooks = async () => {
    try {
      const res = await fetch('/api/featured-book/all');
      const data = await res.json();
      setFeaturedBooks(data.featuredBooks || []);
    } catch (error) {
      console.error('Error fetching featured books:', error);
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setEditingFeatured(null);
    setFormData({
      title: book.title,
      author: book.author,
      coverImage: book.coverImage || '/placeholder-book.jpg',
      category: book.genre || 'Genel',
      description: book.description || '',
      rating: book.averageRating || 0, // Otomatik: kütüphanedeki ortalama puan
      reviewCount: book._count?.reviews || 0, // Otomatik: gerçek yorum sayısı
      readers: book._count?.readingLists || 0, // Otomatik: okuma listesine ekleyen sayısı
      quote: '',
      pages: book.pageCount || 0,
      genre: book.genre || 'Genel',
      badge: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true
    });
  };

  const handleEditFeatured = (featured: FeaturedBook) => {
    setEditingFeatured(featured);
    setSelectedBook(featured.book);
    setFormData({
      title: featured.title,
      author: featured.author,
      coverImage: featured.coverImage,
      category: featured.category,
      description: featured.description,
      rating: featured.rating || 0,
      reviewCount: featured.reviewCount,
      readers: featured.readers,
      quote: featured.quote || '',
      pages: featured.pages || 0,
      genre: featured.genre,
      badge: featured.badge || '',
      startDate: new Date(featured.startDate).toISOString().split('T')[0],
      endDate: featured.endDate ? new Date(featured.endDate).toISOString().split('T')[0] : '',
      isActive: featured.isActive
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBook && !editingFeatured) {
      alert('Lütfen bir kitap seçin');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        bookId: selectedBook?.id || editingFeatured?.bookId,
        rating: parseFloat(formData.rating.toString()) || null,
        reviewCount: parseInt(formData.reviewCount.toString()) || 0,
        readers: parseInt(formData.readers.toString()) || 0,
        pages: parseInt(formData.pages.toString()) || null,
        endDate: formData.endDate || null
      };

      let res;
      if (editingFeatured) {
        // Update existing
        res = await fetch('/api/featured-book', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingFeatured.id, ...payload })
        });
      } else {
        // Create new
        res = await fetch('/api/featured-book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();

      if (res.ok) {
        alert(editingFeatured ? 'Öne çıkan kitap güncellendi!' : 'Öne çıkan kitap oluşturuldu!');
        fetchFeaturedBooks();
        setSelectedBook(null);
        setEditingFeatured(null);
        resetForm();
      } else {
        console.error('API Error:', data);
        
        // Eğer kitap zaten featured ise, kullanıcıya özel mesaj göster
        if (data.error && data.error.includes('zaten öne çıkarılmış')) {
          if (confirm(data.error + '\n\nMevcut kaydı düzenlemek ister misiniz?')) {
            // Mevcut featured book'u bul ve düzenleme moduna al
            const existing = featuredBooks.find(fb => fb.bookId === selectedBook?.id);
            if (existing) {
              handleEditFeatured(existing);
            }
          }
        } else {
          alert(data.error || 'Bir hata oluştu' + (data.details ? `\n${data.details}` : ''));
        }
      }
    } catch (error) {
      console.error('Error saving featured book:', error);
      alert('Kaydetme sırasında hata oluştu: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu öne çıkan kitabı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const res = await fetch(`/api/featured-book?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Öne çıkan kitap silindi!');
        fetchFeaturedBooks();
      } else {
        const data = await res.json();
        alert(data.error || 'Silme sırasında hata oluştu');
      }
    } catch (error) {
      console.error('Error deleting featured book:', error);
      alert('Silme sırasında hata oluştu');
    }
  };

  const toggleActive = async (featured: FeaturedBook) => {
    try {
      const res = await fetch('/api/featured-book', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: featured.id,
          isActive: !featured.isActive
        })
      });

      if (res.ok) {
        fetchFeaturedBooks();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      coverImage: '',
      category: '',
      description: '',
      rating: 0,
      reviewCount: 0,
      readers: 0,
      quote: '',
      pages: 0,
      genre: '',
      badge: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true
    });
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') {
    return <div className="p-8">Yükleniyor...</div>;
  }

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Bu Ayın Kitabı Yönetimi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Book selection and form */}
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Kitap Seç</h2>
            <Input
              placeholder="Kitap ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    selectedBook?.id === book.id ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : ''
                  }`}
                >
                  <div className="font-semibold">{book.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{book.author}</div>
                  {book._count && (book._count.reviews > 0 || book._count.readingLists > 0) && (
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {book._count.reviews > 0 && (
                        <span className="flex items-center gap-1">
                          ⭐ {book.averageRating?.toFixed(1) || '0.0'} 
                          <span className="text-gray-400">({book._count.reviews})</span>
                        </span>
                      )}
                      {book._count.readingLists > 0 && (
                        <span className="flex items-center gap-1">
                          📚 {book._count.readingLists} okuyucu
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {(selectedBook || editingFeatured) && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingFeatured ? 'Öne Çıkan Kitabı Düzenle' : 'Yeni Öne Çıkan Kitap'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Başlık</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Yazar</Label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>

                <ImageUpload
                  label="Kapak Resmi"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  id="coverImage"
                  placeholder="URL girin veya bilgisayar/telefonunuzdan dosya yükleyin"
                  helperText="📱 Telefondan veya bilgisayardan resim yükleyebilir ya da URL girebilirsiniz"
                />

                <div>
                  <Label>Kategori</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Açıklama</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded p-2 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Puan (0-5)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      readOnly
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                      title="Kütüphaneden otomatik alınır"
                    />
                    <p className="text-xs text-gray-500 mt-1">📊 Kütüphaneden otomatik</p>
                  </div>

                  <div>
                    <Label>Yorum Sayısı</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.reviewCount}
                      readOnly
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                      title="Kütüphaneden otomatik alınır"
                    />
                    <p className="text-xs text-gray-500 mt-1">📊 Kütüphaneden otomatik</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Okuyucu Sayısı</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.readers}
                      readOnly
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                      title="Okuma listesine ekleyenler (kütüphaneden otomatik)"
                    />
                    <p className="text-xs text-gray-500 mt-1">📚 Okuma listesine ekleyenler</p>
                  </div>

                  <div>
                    <Label>Sayfa Sayısı</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.pages}
                      onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Alıntı</Label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full border rounded p-2 min-h-[80px]"
                    placeholder="Kitaptan bir alıntı..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tür</Label>
                    <Input
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Rozet</Label>
                    <Input
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Örn: Yeni, Popüler"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Başlangıç Tarihi</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Bitiş Tarihi (Opsiyonel)</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive">Aktif</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : editingFeatured ? 'Güncelle' : 'Oluştur'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedBook(null);
                      setEditingFeatured(null);
                      resetForm();
                    }}
                  >
                    İptal
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Right side: Current featured books */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Mevcut Öne Çıkan Kitaplar</h2>
            <div className="space-y-4">
              {featuredBooks.length === 0 ? (
                <p className="text-gray-500">Henüz öne çıkan kitap yok</p>
              ) : (
                featuredBooks.map((featured) => (
                  <div
                    key={featured.id}
                    className="border rounded p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{featured.title}</h3>
                        <p className="text-sm text-gray-600">{featured.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            featured.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {featured.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          {featured.badge && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                              {featured.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(featured.startDate).toLocaleDateString('tr-TR')} - 
                          {featured.endDate ? new Date(featured.endDate).toLocaleDateString('tr-TR') : ' Süresiz'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleEditFeatured(featured)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(featured)}
                      >
                        {featured.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(featured.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
