#include "stdafx.h"
#include "windows.h"
#include "iostream"

#include "stdio.h"

using namespace std;

#pragma warning (disable : 4996)
int _tmain(int argc, _TCHAR* argv[])
{
    int count;
    int times = 2200;
    FILE *pPipe;
    FILE * pFile;
    long lSize;
    char * buffer;
    size_t result;

    // open a pipe to FFmpeg
    if( (pPipe = _popen( "ffmpeg -re -f image2pipe -vcodec mjpeg -i - -vcodec h264 -r 10 -f mpegts udp://127.0.0.1:1234", "wb")) == NULL ) {exit( 1 );}

    for ( count = 1; count <= times; count++) {
        char filename[40];
        sprintf(&filename[0], ".\\images\\image-%07d.jpg", count);

        pFile = fopen ( filename , "rb" );
        if (pFile==NULL) {fputs ("File error",stderr); exit (2);}

        // obtain file size:
        fseek (pFile , 0 , SEEK_END);
        lSize = ftell (pFile);
        rewind (pFile);

        // allocate memory to contain the whole file:
        buffer = (char*) malloc (sizeof(char)*lSize);
        if (buffer == NULL) {fputs ("Memory error",stderr); exit (3);}

        // copy the file into the buffer:
        result = fread (buffer, 1, lSize, pFile);
        if (result != lSize) {fputs ("Reading error",stderr); exit (4);}

        // write to pipe
        fwrite(buffer, 1, lSize, pPipe); 
        fflush(pPipe);

        // clean
        fclose (pFile);
        free (buffer);

        //
        Sleep(100);
    }

    //
    return 0;
}
