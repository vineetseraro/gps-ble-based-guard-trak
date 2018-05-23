package io.akwa.aksync.network;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * The type Service generator.
 */
public class ServiceGenerator {

    /**
     * The constant retrofit.
     */
    public static Retrofit retrofit;
    private static Retrofit.Builder builder;
    private static HttpLoggingInterceptor logging = new HttpLoggingInterceptor()
            .setLevel(HttpLoggingInterceptor.Level.BODY);

    private static OkHttpClient.Builder httpClient;

    /**
     * Create service s.
     *
     * @param <S>          the type parameter
     * @param serviceClass the service class
     * @return the s
     */
    public static <S> S createService(Class<S> serviceClass) {
        httpClient = new OkHttpClient.Builder();
        builder = new Retrofit.Builder()
                .baseUrl("https://guardtrakapi.akwa.io/")
                .addConverterFactory(GsonConverterFactory.create());

        HeaderInterceptor interceptor =
                new HeaderInterceptor();

        if (!httpClient.interceptors().contains(interceptor)) {
            httpClient.addInterceptor(interceptor);
        }
            if (!httpClient.interceptors().contains(logging)) {
                httpClient.addInterceptor(logging);
            }

            builder.client(httpClient.build());
            retrofit = builder.build();

            return retrofit.create(serviceClass);
        }

    private static class HeaderInterceptor implements Interceptor {
        @Override
        public Response intercept(Chain chain) throws IOException {
            Request original = chain.request();
            Request.Builder builder = original.newBuilder()
                    .addHeader("Accept", "application/json")
                    .addHeader("Content-Type", "application/json")
                    .addHeader("role", "warehouse")
                     .addHeader("appname", "guardtrak")
                    .addHeader("AppType", "guardtrak");

            Request request = builder.build();
            return chain.proceed(request);
        }
    }
}
