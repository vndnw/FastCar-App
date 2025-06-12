package com.example.Backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) {
        try{
            Map<String, Object> options = ObjectUtils.asMap(
                    "transformation", new Transformation().width(500).height(500).crop("fill")
            );
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), options);
            return result.get("secure_url").toString(); // Trả về link ảnh
        }
        catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }


}
