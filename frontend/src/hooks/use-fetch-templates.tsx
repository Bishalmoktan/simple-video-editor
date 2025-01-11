import { useState, useEffect } from "react";
import { axiosClient } from "@/services/api-service";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Templates } from "@/components/template-section";

const useFetchTemplates = (endpoint: string, title: string) => {
  const [templates, setTemplates] = useState<Templates | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axiosClient.get(endpoint);
        setTemplates({
          title,
          images: res.data.images || [],
          videos: res.data.videos || [],
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            description: "Error fetching templates",
            variant: "destructive",
          });
        }
      }
    };

    fetchTemplates();
  }, [endpoint, toast]);

  return templates;
};

export default useFetchTemplates;
