import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth Error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const imageFile = formData.get('imageFile') as File;

    console.log('Received profile update request for user:', user.id);

    let profileImageUrl = null;

    if (imageFile && imageFile.size > 0) {
      console.log('Processing image upload...');
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
         console.error('Cloudinary environment variables missing');
         return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }

      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');
        const dataURI = `data:${imageFile.type};base64,${base64Image}`;

        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'profile_images',
          public_id: `user_${user.id}_profile`,
          overwrite: true,
        });
        profileImageUrl = uploadResponse.secure_url;
        console.log('Image uploaded successfully:', profileImageUrl);
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
      }
    }

    const updates: {
      id: string;
      first_name: string;
      last_name: string;
      mobile: string;
      address: string;
      avatar_url?: string;
    } = {
      id: user.id, // Required for upsert
      first_name: firstName,
      last_name: lastName,
      mobile: phone,
      address: address,
    };

    if (profileImageUrl) {
      updates.avatar_url = profileImageUrl;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(updates);

    if (updateError) {
      console.error('Error updating/upserting profile:', updateError);
      return NextResponse.json({ error: 'Failed to update profile: ' + updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile updated successfully', avatarUrl: profileImageUrl });
  } catch (error) {
    console.error('Error in profile update:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Account ${status === 'active' ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
