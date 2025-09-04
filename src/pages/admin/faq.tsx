import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FAQ } from '@/types/faq';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  subcategory: string;
  is_active: boolean;
  display_order: number;
  meta_title: string;
  meta_description: string;
  keywords: string;
}

const defaultFormData: FAQFormData = {
  question: '',
  answer: '',
  category: '',
  subcategory: '',
  is_active: true,
  display_order: 1,
  meta_title: '',
  meta_description: '',
  keywords: ''
};

const commonCategories = [
  'Airlines', 'Banking', 'E-commerce', 'Food & Dining', 'Healthcare',
  'Insurance', 'Telecom', 'Transportation', 'Utilities', 'General'
];

export default function AdminFAQPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState<FAQFormData>(defaultFormData);
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  // Fetch FAQs
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['admin-faqs', searchTerm],
    queryFn: async (): Promise<FAQ[]> => {
      let query = supabase
        .from('faqs')
        .select('*')
        .order('category')
        .order('display_order');

      if (searchTerm) {
        query = query.or(`question.ilike.%${searchTerm}%,answer.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Create/Update FAQ mutation
  const saveFAQMutation = useMutation({
    mutationFn: async (data: FAQFormData) => {
      const faqData = {
        question: data.question,
        answer: data.answer,
        category: data.category,
        subcategory: data.subcategory || null,
        is_active: data.is_active,
        display_order: data.display_order,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        keywords: data.keywords ? data.keywords.split(',').map(k => k.trim()) : null,
      };

      if (editingFAQ) {
        const { error } = await supabase
          .from('faqs')
          .update(faqData)
          .eq('faq_id', editingFAQ.faq_id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([faqData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingFAQ ? 'FAQ updated successfully' : 'FAQ created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
      setIsDialogOpen(false);
      setEditingFAQ(null);
      setFormData(defaultFormData);
    },
    onError: (error) => {
      toast.error('Failed to save FAQ: ' + error.message);
    },
  });

  // Delete FAQ mutation
  const deleteFAQMutation = useMutation({
    mutationFn: async (faqId: string) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('faq_id', faqId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('FAQ deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
    },
    onError: (error) => {
      toast.error('Failed to delete FAQ: ' + error.message);
    },
  });

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      subcategory: faq.subcategory || '',
      is_active: faq.is_active,
      display_order: faq.display_order,
      meta_title: faq.meta_title || '',
      meta_description: faq.meta_description || '',
      keywords: faq.keywords?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (faqId: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      deleteFAQMutation.mutate(faqId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    saveFAQMutation.mutate(formData);
  };

  const handleNewFAQ = () => {
    setEditingFAQ(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">FAQ Management</h1>
            <p className="text-muted-foreground">Manage frequently asked questions for your platform</p>
          </div>
          <Button onClick={handleNewFAQ}>
            <Plus className="h-4 w-4 mr-2" />
            Add New FAQ
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No FAQs found</p>
              </CardContent>
            </Card>
          ) : (
            faqs.map((faq) => (
              <Card key={faq.faq_id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{faq.category}</Badge>
                        {faq.subcategory && <Badge variant="secondary">{faq.subcategory}</Badge>}
                        <Badge variant={faq.is_active ? "default" : "destructive"}>
                          {faq.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">Order: {faq.display_order}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(faq.faq_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{faq.answer}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* FAQ Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFAQ ? 'Edit FAQ' : 'Create New FAQ'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="question">Question *</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="answer">Answer *</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                    min="1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="meta_title">Meta Title (SEO)</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    maxLength={60}
                  />
                  <p className="text-sm text-muted-foreground">Max 60 characters</p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">Max 160 characters</p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="keywords">Keywords (SEO)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-sm text-muted-foreground">Separate with commas</p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saveFAQMutation.isPending}
                >
                  {saveFAQMutation.isPending
                    ? 'Saving...'
                    : editingFAQ
                    ? 'Update FAQ'
                    : 'Create FAQ'
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}